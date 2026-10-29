import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getTrail } from '../../data/trails';
import { getSession, getUserKey } from '../../services/session';
import { useAssessment } from '../assessment/AssessmentContext';
import { asyncKeyValueStorage } from '../assessment/asyncStorage';
import { MyTrail, TrailView, buildMyTrails, buildTrailView, markStepCompleted, pickContinueTrail } from './trailModel';
import { emptyTrailStore, loadTrailStore, saveTrailStore } from './trailStorage';
import { ProgressStore } from './types';

export type CompleteResult = { ok: true; alreadyCompleted: boolean } | { ok: false; error: string };

type TrailContextValue = {
  /** Progresso do usuário carregado do aparelho. */
  ready: boolean;
  /** Trilhas do usuário (derivadas das avaliações concluídas), com progresso. */
  myTrails: MyTrail[];
  /** Trilha em andamento (para a Home). null = nenhuma. */
  continueTrail: MyTrail | null;
  /** Visão completa de UMA trilha (etapas, estados, %). null = trilha inexistente. */
  getView: (trailId: string | undefined | null) => TrailView | null;
  /** Marca a etapa como concluída. Só altera o estado se a gravação der certo. */
  completeStep: (trailId: string, stepId: string) => Promise<CompleteResult>;
};

const Ctx = createContext<TrailContextValue | null>(null);

/**
 * ÚNICA fonte do progresso das trilhas. Home, Minhas Trilhas, Visão Geral, Conteúdo da Etapa
 * e Etapa Concluída leem daqui: marcar uma etapa atualiza todas ao mesmo tempo.
 *
 * Persistência: AsyncStorage, por usuário (chave techpath.trails.v1:<e-mail>). Não há backend
 * de trilhas/progresso; quando existir, troque load/save por chamadas à API.
 */
export function TrailProvider({ children }: { children: ReactNode }) {
  const { ready: assessmentReady, history } = useAssessment();
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<ProgressStore>(emptyTrailStore().progress);

  const progressRef = useRef<ProgressStore>(progress);
  const userKeyRef = useRef<string | null>(null);
  const inFlight = useRef<Set<string>>(new Set());

  // Carrega junto com os dados do usuário; limpa ao sair da conta.
  useEffect(() => {
    if (!assessmentReady) {
      userKeyRef.current = null;
      progressRef.current = {};
      setProgress({});
      setReady(false);
      return;
    }
    let active = true;
    (async () => {
      const session = await getSession().catch(() => null);
      if (!active || !session) return;
      const key = getUserKey(session);
      userKeyRef.current = key;
      let loaded: ProgressStore = {};
      try {
        loaded = (await loadTrailStore(asyncKeyValueStorage, key)).progress;
      } catch {
        loaded = {};
      }
      if (!active) return;
      progressRef.current = loaded;
      setProgress(loaded);
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, [assessmentReady]);

  const myTrails = useMemo(() => buildMyTrails(history, progress), [history, progress]);
  const continueTrail = useMemo(() => pickContinueTrail(myTrails), [myTrails]);

  const getView = useCallback(
    (trailId: string | undefined | null): TrailView | null => {
      const trail = getTrail(trailId);
      return trail ? buildTrailView(trail, progress[trail.id] ?? {}) : null;
    },
    [progress],
  );

  const completeStep = useCallback(async (trailId: string, stepId: string): Promise<CompleteResult> => {
    const key = userKeyRef.current;
    if (!key) return { ok: false, error: 'Sua sessão não está ativa. Entre novamente.' };

    const trail = getTrail(trailId);
    if (!trail || !trail.steps.some((s) => s.id === stepId)) return { ok: false, error: 'Etapa não encontrada.' };

    // já concluída: não registra de novo
    if (progressRef.current[trailId]?.[stepId]) return { ok: true, alreadyCompleted: true };

    const lock = `${trailId}:${stepId}`;
    if (inFlight.current.has(lock)) return { ok: false, error: 'Salvando… aguarde.' }; // evita duplicar
    inFlight.current.add(lock);
    try {
      const next = markStepCompleted(progressRef.current, trailId, stepId, new Date().toISOString());
      // grava ANTES de atualizar a interface: se falhar, nada fica marcado
      await saveTrailStore(asyncKeyValueStorage, key, { version: 1, progress: next });
      progressRef.current = next;
      setProgress(next);
      return { ok: true, alreadyCompleted: false };
    } catch {
      return { ok: false, error: 'Não foi possível salvar a conclusão neste aparelho. A etapa NÃO foi marcada como concluída.' };
    } finally {
      inFlight.current.delete(lock);
    }
  }, []);

  const value = useMemo(
    () => ({ ready, myTrails, continueTrail, getView, completeStep }),
    [ready, myTrails, continueTrail, getView, completeStep],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTrails(): TrailContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTrails precisa estar dentro de <TrailProvider>.');
  return ctx;
}

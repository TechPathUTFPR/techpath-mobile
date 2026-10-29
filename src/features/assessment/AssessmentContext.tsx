import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { getSession, getUserKey } from '../../services/session';
import { AREAS } from '../../data/questionnaire';
import {
  createAssessment,
  finalizeAssessment,
  stateFromStored,
  summarize,
  syncStored,
  toAssessmentResult,
} from './assessmentModel';
import { asyncKeyValueStorage } from './asyncStorage';
import { buildDemoResult } from './demoData';
import {
  AdvanceOutcome,
  AssessmentState,
  goBack as goBackState,
  initialState,
  selectOption,
  tryAdvance,
} from './logic';
import { IncompleteAssessmentError } from './scoring';
import { emptyStore, loadUserStore, saveUserStore } from './storage';
import { AssessmentResult, HistoryItem, StoredAssessment } from './types';

type InitInfo = { historyCount: number; hasInProgress: boolean };

type AssessmentContextValue = {
  /** Dados do usuário já carregados do aparelho. */
  ready: boolean;
  loadError: string | null;
  storageError: string | null;
  /** Estado da avaliação em andamento (o que a tela do questionário exibe). */
  state: AssessmentState;
  /** Há uma avaliação com respostas para retomar ("Continuar de onde parei"). */
  hasInProgress: boolean;
  /** Avaliações concluídas, da mais antiga para a mais recente. */
  history: HistoryItem[];
  /** Resultado em exibição (recém-calculado, aberto do histórico ou simulado). */
  result: AssessmentResult | null;
  /** Carrega os dados do usuário (chamado após login). */
  init: (userKey: string) => Promise<InitInfo>;
  /** Inicia uma avaliação nova ou retoma a que está em andamento (RN07). */
  begin: () => void;
  select: (optionId: string) => void;
  goNext: () => AdvanceOutcome;
  goBack: () => void;
  /** Abre o resultado de uma avaliação do histórico (somente leitura). */
  openHistoryResult: (id: string) => boolean;
  /** Logout: limpa a MEMÓRIA. Não apaga o que está salvo no aparelho. */
  reset: () => void;
  loadDemoResult: () => void;
};

const Ctx = createContext<AssessmentContextValue | null>(null);

const nowIso = () => new Date().toISOString();

/**
 * Guarda o andamento do questionário e o histórico do usuário, e os persiste no aparelho
 * (AsyncStorage) a cada resposta (RN06). Telas diferentes leem o MESMO objeto de resultado,
 * então abrir/voltar nunca recalcula nada.
 */
export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [state, setState] = useState<AssessmentState>(initialState());
  const [inProgress, setInProgress] = useState<StoredAssessment | null>(null);
  const [historyRaw, setHistoryRaw] = useState<StoredAssessment[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const userKeyRef = useRef<string | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const inProgressRef = useRef<StoredAssessment | null>(null);
  const historyRef = useRef<StoredAssessment[]>([]);
  const writeChain = useRef<Promise<void>>(Promise.resolve());
  const initRef = useRef<{ key: string; promise: Promise<InitInfo> } | null>(null);

  /** Grava (em fila, para não misturar escritas) o estado atual do usuário. */
  const persist = useCallback((nextInProgress: StoredAssessment | null, nextHistory: StoredAssessment[]) => {
    inProgressRef.current = nextInProgress;
    historyRef.current = nextHistory;
    setInProgress(nextInProgress);
    setHistoryRaw(nextHistory);
    const key = userKeyRef.current;
    if (!key) return;
    const snapshot = { version: 1 as const, inProgress: nextInProgress, history: nextHistory };
    writeChain.current = writeChain.current
      .then(() => saveUserStore(asyncKeyValueStorage, key, snapshot))
      .then(() => setStorageError(null))
      .catch(() => setStorageError('Não foi possível salvar seu progresso neste aparelho.'));
  }, []);

  const init = useCallback((userKey: string): Promise<InitInfo> => {
    // Só reaproveita uma carga que ainda está EM ANDAMENTO para o mesmo usuário.
    if (initRef.current && initRef.current.key === userKey) return initRef.current.promise;

    const promise: Promise<InitInfo> = (async (): Promise<InitInfo> => {
      userKeyRef.current = userKey;
      setReady(false);
      setLoadError(null);
      // espera escritas pendentes (ex.: avaliação recém-concluída) antes de reler o aparelho
      await writeChain.current.catch(() => undefined);
      let store = emptyStore();
      try {
        store = await loadUserStore(asyncKeyValueStorage, userKey);
      } catch {
        setLoadError('Não foi possível carregar seus dados salvos neste aparelho.');
      }
      inProgressRef.current = store.inProgress;
      historyRef.current = store.history;
      setInProgress(store.inProgress);
      setHistoryRaw(store.history);
      const core = store.inProgress ? stateFromStored(store.inProgress) : initialState();
      stateRef.current = core;
      setState(core);
      setResult(null);
      setReady(true);
      return {
        historyCount: store.history.length,
        hasInProgress: !!store.inProgress && Object.keys(store.inProgress.answers).length > 0,
      };
    })();

    initRef.current = { key: userKey, promise };
    promise.finally(() => {
      if (initRef.current?.promise === promise) initRef.current = null;
    });
    return promise;
  }, []);

  const commit = useCallback(
    (core: AssessmentState) => {
      stateRef.current = core;
      setState(core);
      const current = inProgressRef.current;
      if (current) persist(syncStored(current, core, nowIso()), historyRef.current);
    },
    [persist],
  );

  const begin = useCallback(() => {
    setResult(null);
    const existing = inProgressRef.current;
    if (existing) {
      const core = stateFromStored(existing);
      stateRef.current = core;
      setState(core);
      return; // retoma de onde parou
    }
    const created = createAssessment({ now: nowIso() });
    const core = stateFromStored(created);
    stateRef.current = core;
    setState(core);
    persist(created, historyRef.current);
  }, [persist]);

  const select = useCallback(
    (optionId: string) => {
      const next = selectOption(stateRef.current, optionId);
      if (next !== stateRef.current) commit(next);
    },
    [commit],
  );

  const goNext = useCallback((): AdvanceOutcome => {
    const { state: next, outcome } = tryAdvance(stateRef.current);
    if (outcome === 'blocked') return outcome;
    if (outcome === 'advanced') {
      commit(next);
      return outcome;
    }
    // concluída: calcula e move para o histórico (RN02, RN08)
    const current = inProgressRef.current;
    if (!current) return 'blocked';
    try {
      const now = nowIso();
      const finalized = finalizeAssessment(syncStored(current, next, now), now);
      stateRef.current = next;
      setState(next);
      setResult(toAssessmentResult(finalized));
      persist(null, [...historyRef.current, finalized]);
      return 'completed';
    } catch (e) {
      if (e instanceof IncompleteAssessmentError) return 'blocked';
      setStorageError('Não foi possível calcular o resultado.');
      return 'blocked';
    }
  }, [commit, persist]);

  const goBack = useCallback(() => {
    commit(goBackState(stateRef.current));
  }, [commit]);

  const openHistoryResult = useCallback((id: string) => {
    const item = historyRef.current.find((a) => a.id === id);
    const r = item ? toAssessmentResult(item) : null;
    setResult(r);
    return !!r;
  }, []);

  const reset = useCallback(() => {
    userKeyRef.current = null;
    initRef.current = null;
    inProgressRef.current = null;
    historyRef.current = [];
    stateRef.current = initialState();
    setState(initialState());
    setInProgress(null);
    setHistoryRaw([]);
    setResult(null);
    setLoadError(null);
    setStorageError(null);
    setReady(false);
  }, []);

  const loadDemoResult = useCallback(() => setResult(buildDemoResult()), []);

  const history = useMemo(
    () => historyRaw.map((a) => summarize(a, AREAS)).filter((h): h is HistoryItem => h !== null),
    [historyRaw],
  );
  const hasInProgress = !!inProgress && Object.keys(inProgress.answers).length > 0;

  const value = useMemo<AssessmentContextValue>(
    () => ({
      ready,
      loadError,
      storageError,
      state,
      hasInProgress,
      history,
      result,
      init,
      begin,
      select,
      goNext,
      goBack,
      openHistoryResult,
      reset,
      loadDemoResult,
    }),
    [ready, loadError, storageError, state, hasInProgress, history, result, init, begin, select, goNext, goBack, openHistoryResult, reset, loadDemoResult],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAssessment(): AssessmentContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAssessment precisa estar dentro de <AssessmentProvider>.');
  return ctx;
}

/**
 * Garante sessão e dados carregados para a tela. Sem sessão -> Login.
 * (O app sempre abre no Login, então normalmente `ready` já é true ao chegar aqui;
 * isto cobre recarga de tela durante o desenvolvimento.)
 */
export function useAssessmentBootstrap() {
  const router = useRouter();
  const { ready, init } = useAssessment();

  useEffect(() => {
    if (ready) return;
    let active = true;
    getSession()
      .then(async (session) => {
        if (!active) return;
        if (!session) {
          router.replace('/login');
          return;
        }
        await init(getUserKey(session));
      })
      .catch(() => router.replace('/login'));
    return () => {
      active = false;
    };
  }, [ready, init, router]);

  return ready;
}

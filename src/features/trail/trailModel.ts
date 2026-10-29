import { TRAILS } from '../../data/trails';
import { getTrailPercent, isTrailFinished } from './progress';
import { ProgressStore, TrailDef, TrailStepDef } from './types';

/**
 * Regras de trilha e progresso como funções PURAS (sem React, sem armazenamento).
 *
 * Regras adotadas (a especificação não define bloqueio entre etapas):
 *  - ACESSO LIVRE: qualquer etapa pode ser aberta e concluída em qualquer ordem.
 *  - Etapa ATUAL = a primeira ainda não concluída; as demais não concluídas são FUTURAS.
 *  - Abrir o conteúdo NUNCA conclui a etapa; só "Marcar como concluído".
 */

export type StepState = 'completed' | 'current' | 'future';

export type StepView = {
  step: TrailStepDef;
  /** Posição 1-based. */
  order: number;
  state: StepState;
  completedAt?: string;
};

export type TrailView = {
  trail: TrailDef;
  steps: StepView[];
  completedCount: number;
  total: number;
  percent: number;
  finished: boolean;
  currentStepId: string | null;
};

export function buildTrailView(trail: TrailDef, completions: Record<string, string> = {}): TrailView {
  let currentAssigned = false;
  const steps: StepView[] = trail.steps.map((step, i) => {
    const completedAt = completions[step.id];
    let state: StepState;
    if (completedAt) state = 'completed';
    else if (!currentAssigned) {
      state = 'current';
      currentAssigned = true;
    } else state = 'future';
    return { step, order: i + 1, state, completedAt };
  });
  const completedCount = steps.filter((s) => s.state === 'completed').length;
  const total = steps.length;
  return {
    trail,
    steps,
    completedCount,
    total,
    percent: getTrailPercent(completedCount, total),
    finished: isTrailFinished(completedCount, total),
    currentStepId: steps.find((s) => s.state === 'current')?.step.id ?? null,
  };
}

/** Marca a etapa como concluída. Idempotente (não duplica) e sem mutar o original. */
export function markStepCompleted(
  progress: ProgressStore,
  trailId: string,
  stepId: string,
  nowIso: string,
): ProgressStore {
  if (progress[trailId]?.[stepId]) return progress;
  return { ...progress, [trailId]: { ...(progress[trailId] ?? {}), [stepId]: nowIso } };
}

/** Próxima etapa PENDENTE depois de `afterStepId` (ou a primeira pendente, se não houver depois). null = tudo concluído. */
export function nextPendingStep(view: TrailView, afterStepId?: string): StepView | null {
  const idx = afterStepId ? view.steps.findIndex((s) => s.step.id === afterStepId) : -1;
  const after = view.steps.slice(idx + 1).find((s) => s.state !== 'completed');
  return after ?? view.steps.find((s) => s.state !== 'completed') ?? null;
}

/** Etapa anterior na ordem da trilha (null na primeira). */
export function previousStep(view: TrailView, stepId: string): StepView | null {
  const idx = view.steps.findIndex((s) => s.step.id === stepId);
  return idx > 0 ? view.steps[idx - 1] : null;
}

// ---------------------------------------------------------------------------
// Trilhas do usuário (derivadas das avaliações concluídas)
// ---------------------------------------------------------------------------

export type MyTrail = {
  trail: TrailDef;
  /** Quando a trilha foi recomendada pela 1ª vez (data da avaliação). */
  addedAt: string;
  /** Última atividade: a mais recente entre a recomendação e uma etapa concluída. */
  lastActivityAt: string;
  completedCount: number;
  total: number;
  percent: number;
  finished: boolean;
  /** O sistema de favoritos ainda não existe: sempre false. */
  favorite: boolean;
};

const time = (iso: string) => {
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
};

/**
 * Cada avaliação concluída recomenda a trilha da(s) área(s) principal(is) (híbrido => várias).
 * Trilhas repetidas entre avaliações aparecem uma vez. Ordem: da mais antiga recomendação para a mais nova.
 */
export function buildMyTrails(
  history: { completedAt: string; areaCodes: string[] }[],
  progress: ProgressStore,
  catalog: TrailDef[] = TRAILS,
): MyTrail[] {
  const added = new Map<string, { trail: TrailDef; addedAt: string }>();
  [...history]
    .sort((a, b) => time(a.completedAt) - time(b.completedAt))
    .forEach((h) => {
      h.areaCodes.forEach((code) => {
        const trail = catalog.find((t) => t.areaCode === code);
        if (trail && !added.has(trail.id)) added.set(trail.id, { trail, addedAt: h.completedAt });
      });
    });

  return [...added.values()].map(({ trail, addedAt }) => {
    const view = buildTrailView(trail, progress[trail.id] ?? {});
    const lastActivity = view.steps.reduce(
      (max, s) => (s.completedAt && time(s.completedAt) > time(max) ? s.completedAt : max),
      addedAt,
    );
    return {
      trail,
      addedAt,
      lastActivityAt: lastActivity,
      completedCount: view.completedCount,
      total: view.total,
      percent: view.percent,
      finished: view.finished,
      favorite: false,
    };
  });
}

/** Trilha "em andamento" para a Home: a de atividade mais recente que ainda tem etapas pendentes. */
export function pickContinueTrail(trails: MyTrail[]): MyTrail | null {
  return (
    [...trails]
      .filter((t) => t.total > 0 && !t.finished)
      .sort((a, b) => time(b.lastActivityAt) - time(a.lastActivityAt))[0] ?? null
  );
}

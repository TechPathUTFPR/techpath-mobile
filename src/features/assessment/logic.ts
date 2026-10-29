import { Answers, AreaAffinity, AssessmentResult, Question } from './types';

/** Estado puro do questionário (sem React) — facilita testar e trocar a interface. */
export type AssessmentState = {
  questions: Question[];
  index: number;
  answers: Answers;
  completed: boolean;
};

export const initialState = (questions: Question[] = []): AssessmentState => ({
  questions,
  index: 0,
  answers: {},
  completed: false,
});

export const isRequired = (q: Question) => q.required !== false;
export const getSelected = (answers: Answers, q: Question): string[] => answers[q.id] ?? [];
export const isAnswered = (answers: Answers, q: Question) => getSelected(answers, q).length > 0;

/**
 * Progresso: posição atual (1-based) / total. Seguro para lista vazia (total 0 -> tudo 0).
 * Ex.: 10 de 20 => percent 50.
 */
export function getProgress(index: number, total: number) {
  if (!Number.isFinite(total) || total <= 0) return { current: 0, total: 0, percent: 0 };
  const current = Math.min(Math.max(index + 1, 1), total);
  return { current, total, percent: (current / total) * 100 };
}

/** Seleciona/alterna uma alternativa da pergunta atual. */
export function selectOption(state: AssessmentState, optionId: string): AssessmentState {
  const q = state.questions[state.index];
  if (!q || state.completed) return state;
  if (!q.options.some((o) => o.id === optionId)) return state;

  const current = getSelected(state.answers, q);
  let next: string[];
  if (q.multiple) {
    next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
  } else if (current.includes(optionId) && !isRequired(q)) {
    next = []; // pergunta opcional: tocar de novo desmarca
  } else {
    next = [optionId];
  }
  return { ...state, answers: { ...state.answers, [q.id]: next } };
}

export type AdvanceOutcome = 'blocked' | 'advanced' | 'completed';

/** "Próxima": valida a obrigatoriedade, avança ou conclui na última pergunta. */
export function tryAdvance(state: AssessmentState): { state: AssessmentState; outcome: AdvanceOutcome } {
  const q = state.questions[state.index];
  if (!q || state.completed) return { state, outcome: 'blocked' };
  if (isRequired(q) && !isAnswered(state.answers, q)) return { state, outcome: 'blocked' };
  if (state.index < state.questions.length - 1) {
    return { state: { ...state, index: state.index + 1 }, outcome: 'advanced' };
  }
  return { state: { ...state, completed: true }, outcome: 'completed' };
}

/** "Voltar": nunca vai abaixo de 0 e NUNCA apaga respostas. */
export function goBack(state: AssessmentState): AssessmentState {
  return state.index > 0 ? { ...state, index: state.index - 1 } : state;
}

/** Há respostas/andamento que seriam perdidos ao abandonar? */
export const isInProgress = (state: AssessmentState) =>
  !state.completed && (state.index > 0 || Object.keys(state.answers).length > 0);

/** Separa principal x demais, ordenando por afinidade (maior primeiro; empate mantém a ordem recebida). */
export function splitAreas(result: AssessmentResult | null): {
  principal: AreaAffinity | null;
  others: AreaAffinity[];
} {
  if (!result || result.areas.length === 0) return { principal: null, others: [] };
  const sorted = result.areas
    .map((a, i) => ({ a, i }))
    .sort((x, y) => y.a.percent - x.a.percent || x.i - y.i)
    .map((x) => x.a);
  return { principal: sorted[0], others: sorted.slice(1) };
}

export const formatPercent = (value: number) => `${Math.round(Math.min(Math.max(value, 0), 100))}%`;

import {
  AREAS,
  AreaDef,
  BankQuestion,
  MIN_QUESTIONS_PER_AREA,
  QUESTION_BANK,
  QUESTION_CATEGORY_LABEL,
  SCALE,
  ScaleOption,
} from '../../data/questionnaire';
import { AssessmentState, initialState } from './logic';
import { IncompleteAssessmentError, ScoreInput, computeScores } from './scoring';
import {
  Answers,
  AssessmentResult,
  HistoryItem,
  Question,
  StoredAnswer,
  StoredAssessment,
} from './types';

/**
 * Regras da avaliação (criar, responder, finalizar) como funções PURAS sobre os
 * modelos guardados. Não tocam em React nem em armazenamento — por isso são testáveis
 * e podem ser trocadas pela API quando o backend implementar os endpoints.
 */

type Bank = BankQuestion[];

/** RN13: só entram áreas ativas com pelo menos 5 perguntas ativas. */
export function eligibleQuestions(areas: AreaDef[] = AREAS, bank: Bank = QUESTION_BANK): BankQuestion[] {
  const okAreas = new Set(
    areas
      .filter((a) => a.active)
      .filter((a) => bank.filter((q) => q.active && q.areaCode === a.code).length >= MIN_QUESTIONS_PER_AREA)
      .map((a) => a.code),
  );
  return bank.filter((q) => q.active && okAreas.has(q.areaCode));
}

/** Fisher–Yates. `random` é injetável para teste. */
export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function newId(now = Date.now(), random: () => number = Math.random): string {
  return `${now.toString(36)}-${Math.floor(random() * 36 ** 6).toString(36).padStart(6, '0')}`;
}

/** Cria uma avaliação: congela QUAIS perguntas entram e em QUE ORDEM (RN04, RN14). */
export function createAssessment(params: {
  id?: string;
  now: string;
  areas?: AreaDef[];
  bank?: Bank;
  random?: () => number;
}): StoredAssessment {
  const questions = eligibleQuestions(params.areas ?? AREAS, params.bank ?? QUESTION_BANK);
  return {
    id: params.id ?? newId(),
    status: 'EM_ANDAMENTO',
    startedAt: params.now,
    order: shuffle(
      questions.map((q) => q.code),
      params.random,
    ).slice(),
    index: 0,
    answers: {},
  };
}

/**
 * Perguntas da INTERFACE: só id, enunciado, categoria genérica e as 5 opções da escala
 * (rótulos). Sem área, sem peso, sem valor (RN05, CT15).
 */
export function toUiQuestions(order: string[], bank: Bank = QUESTION_BANK, scale: ScaleOption[] = SCALE): Question[] {
  const byCode = new Map(bank.map((q) => [q.code, q]));
  const options = [...scale].sort((a, b) => a.order - b.order).map((o) => ({ id: o.id, text: o.label }));
  return order
    .map((code) => byCode.get(code))
    .filter((q): q is BankQuestion => !!q)
    .map((q) => ({ id: q.code, category: QUESTION_CATEGORY_LABEL, text: q.text, options }));
}

/** Estado da interface a partir da avaliação guardada (retomar de onde parou, RN06/RN07). */
export function stateFromStored(stored: StoredAssessment, bank: Bank = QUESTION_BANK): AssessmentState {
  const questions = toUiQuestions(stored.order, bank);
  const answers: Answers = {};
  Object.entries(stored.answers).forEach(([code, a]) => {
    answers[code] = [a.optionId];
  });
  const index = Math.min(Math.max(stored.index, 0), Math.max(questions.length - 1, 0));
  return { ...initialState(questions), index, answers };
}

/**
 * Leva as respostas da interface para o modelo guardado. Cada resposta grava uma CÓPIA do
 * valor, do peso e da área vigentes (RN11); responder de novo substitui a anterior (RN03).
 */
export function syncStored(
  stored: StoredAssessment,
  core: AssessmentState,
  now: string,
  bank: Bank = QUESTION_BANK,
  scale: ScaleOption[] = SCALE,
): StoredAssessment {
  const byCode = new Map(bank.map((q) => [q.code, q]));
  const byOption = new Map(scale.map((o) => [o.id, o]));
  const answers: Record<string, StoredAnswer> = {};

  Object.entries(core.answers).forEach(([code, optionIds]) => {
    const optionId = optionIds[0];
    const question = byCode.get(code);
    const option = optionId ? byOption.get(optionId) : undefined;
    if (!question || !option) return;
    const previous = stored.answers[code];
    answers[code] =
      previous && previous.optionId === optionId
        ? previous // mesma resposta: mantém a cópia original
        : { optionId, value: option.value, weight: question.weight, areaCode: question.areaCode, answeredAt: now };
  });

  return { ...stored, answers, index: core.index };
}

/** Finaliza: valida 100% respondido, calcula e congela (RN02, RN08). Lança IncompleteAssessmentError. */
export function finalizeAssessment(stored: StoredAssessment, now: string, areas: AreaDef[] = AREAS): StoredAssessment {
  const missing = stored.order.filter((code) => !stored.answers[code]).length;
  if (missing > 0) throw new IncompleteAssessmentError(missing);

  const inputs: ScoreInput[] = stored.order.map((code) => {
    const a = stored.answers[code];
    return { questionCode: code, areaCode: a.areaCode, value: a.value, weight: a.weight };
  });
  const scores = computeScores(
    [...areas].sort((a, b) => a.order - b.order).map((a) => a.code),
    inputs,
  );

  return {
    ...stored,
    status: 'CONCLUIDA',
    completedAt: now,
    result: {
      areas: scores.areas,
      hybrid: scores.hybrid,
      inDiscovery: scores.inDiscovery,
      uniformAnswers: scores.uniformAnswers,
    },
  };
}

/** Objeto de resultado usado pelas telas Resultado / Resultado Completo. */
export function toAssessmentResult(stored: StoredAssessment, areas: AreaDef[] = AREAS): AssessmentResult | null {
  if (!stored.result) return null;
  const byCode = new Map(areas.map((a) => [a.code, a]));
  return {
    id: stored.id,
    completedAt: stored.completedAt ?? stored.startedAt,
    hybrid: stored.result.hybrid,
    inDiscovery: stored.result.inDiscovery,
    uniformAnswers: stored.result.uniformAnswers,
    areas: stored.result.areas.map((r) => ({
      areaId: r.code,
      name: byCode.get(r.code)?.name ?? r.code,
      description: byCode.get(r.code)?.description,
      percent: r.percent,
      points: r.points,
      maxPoints: r.maxPoints,
      position: r.position,
      principal: r.principal,
    })),
  };
}

/** Resumo para o cartão do Histórico. */
export function summarize(stored: StoredAssessment, areas: AreaDef[] = AREAS): HistoryItem | null {
  const result = toAssessmentResult(stored, areas);
  if (!result || result.areas.length === 0) return null;
  const principals = result.areas.filter((a) => a.principal);
  const shown = principals.length > 0 ? principals : [result.areas[0]];
  return {
    id: stored.id,
    completedAt: result.completedAt,
    title: shown.map((a) => a.name).join(' + '),
    areaCodes: shown.map((a) => a.areaId),
    percent: shown[0].percent,
    hybrid: !!result.hybrid,
    favorite: !!stored.favorite,
  };
}

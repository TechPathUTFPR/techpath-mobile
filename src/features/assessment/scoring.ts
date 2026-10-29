import { DISCOVERY_THRESHOLD } from '../../data/questionnaire';
import { StoredAreaResult } from './types';

/**
 * CÁLCULO DO RESULTADO — implementa a "Regra de cálculo" da Especificação do
 * Questionário de Afinidade (v1). Funções PURAS: sem React, sem armazenamento.
 *
 *   Pontos(a)    = Σ valor(resposta) × peso(pergunta)
 *   Máximo(a)    = Σ 4 × peso(pergunta)
 *   Afinidade(a) = Pontos / Máximo × 100         (comparada SEM arredondar)
 *
 * Desempate no topo: 1) mais respostas "Sempre é verdade"; 2) persistindo, todas as
 * empatadas são principais e o perfil é HÍBRIDO. Empates no meio do ranking usam o
 * mesmo critério e, por fim, a ordem de cadastro das áreas.
 *
 * ATENÇÃO (RN10): na especificação este cálculo roda no BACKEND. Aqui ele roda no app
 * enquanto os endpoints não existem; quando existirem, a camada de dados passa a
 * receber o resultado pronto e este arquivo deixa de ser usado pelo app.
 */

export const MAX_VALUE = 4;
const EPS = 1e-9;

export type ScoreInput = {
  questionCode: string;
  areaCode: string;
  /** Valor da opção (0–4) copiado no momento da resposta. */
  value: number;
  weight: number;
};

export type ScoreOutput = {
  /** Já em ordem de ranking, com posição e flag `principal`. */
  areas: StoredAreaResult[];
  hybrid: boolean;
  inDiscovery: boolean;
  uniformAnswers: boolean;
};

/** Equivalente ao HTTP 422 da especificação: faltam respostas. */
export class IncompleteAssessmentError extends Error {
  missing: number;
  constructor(missing: number) {
    super(`Faltam ${missing} resposta(s) para finalizar a avaliação.`);
    this.name = 'IncompleteAssessmentError';
    this.missing = missing;
  }
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * @param areaOrder  códigos das áreas na ORDEM DE CADASTRO (desempate final)
 * @param answers    todas as respostas da avaliação (já validadas como completas)
 */
export function computeScores(areaOrder: string[], answers: ScoreInput[]): ScoreOutput {
  if (answers.length === 0) throw new IncompleteAssessmentError(0);

  const rows = areaOrder
    .map((code, order) => {
      const list = answers.filter((a) => a.areaCode === code);
      if (list.length === 0) return null; // área sem perguntas na avaliação não entra
      const points = list.reduce((sum, a) => sum + a.value * a.weight, 0);
      const maxPoints = list.reduce((sum, a) => sum + MAX_VALUE * a.weight, 0);
      return {
        code,
        order,
        points,
        maxPoints,
        raw: maxPoints > 0 ? (points / maxPoints) * 100 : 0,
        qtdSempre: list.filter((a) => a.value === MAX_VALUE).length,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const sorted = [...rows].sort((a, b) => {
    if (Math.abs(a.raw - b.raw) > EPS) return b.raw - a.raw; // maior afinidade primeiro
    if (a.qtdSempre !== b.qtdSempre) return b.qtdSempre - a.qtdSempre; // mais "Sempre é verdade"
    return a.order - b.order; // ordem de cadastro
  });

  const best = sorted[0];
  const principalSet = new Set(
    sorted
      .filter((r) => Math.abs(r.raw - best.raw) <= EPS && r.qtdSempre === best.qtdSempre)
      .map((r) => r.code),
  );

  const values = new Set(answers.map((a) => a.value));

  return {
    areas: sorted.map((r, i) => ({
      code: r.code,
      points: round2(r.points),
      maxPoints: round2(r.maxPoints),
      percent: round2(r.raw), // grava com 2 casas; a tela mostra inteiro
      qtdSempre: r.qtdSempre,
      position: i + 1,
      principal: principalSet.has(r.code),
    })),
    hybrid: principalSet.size > 1,
    // "passar de 40%": exatamente 40% ainda é perfil em descoberta (CT06)
    inDiscovery: best.raw <= DISCOVERY_THRESHOLD + EPS,
    uniformAnswers: answers.length > 1 && values.size === 1,
  };
}

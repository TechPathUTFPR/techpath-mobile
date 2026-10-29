/**
 * MODELOS DO QUESTIONÁRIO E DO RESULTADO
 *
 * Duas camadas:
 *  1) Modelos de INTERFACE (Question, Option, Answers, AssessmentResult…) — o que as telas usam.
 *     A pergunta da interface NÃO tem área nem peso (RN05).
 *  2) Modelos GUARDADOS (Stored*) — o que fica no aparelho, por usuário (espelha as tabelas
 *     avaliacoes / respostas / resultado_area da especificação).
 */

export type Option = { id: string; text: string };

export type Question = {
  id: string;
  category: string;
  text: string;
  options: Option[];
  multiple?: boolean;
  required?: boolean;
};

/** questionId -> ids das alternativas escolhidas. */
export type Answers = Record<string, string[]>;

export type AreaAffinity = {
  areaId: string; // código da área (DEV, UX…)
  name: string;
  /** 0 a 100. */
  percent: number;
  description?: string;
  imageUrl?: string;
  points?: number;
  maxPoints?: number;
  position?: number;
  /** true para a(s) área(s) principal(is). */
  principal?: boolean;
};

export type AssessmentResult = {
  id: string;
  completedAt: string; // ISO
  /** Áreas já em ordem de ranking (a primeira é a principal). */
  areas: AreaAffinity[];
  trailId?: string;
  /** true = dados de TESTE. A interface exibe um aviso. */
  simulated?: boolean;
  /** Empate no topo mesmo após o desempate: mais de uma área principal. */
  hybrid?: boolean;
  /** Nenhuma área passou de 40%. */
  inDiscovery?: boolean;
  /** Mesma opção escolhida em todas as perguntas. */
  uniformAnswers?: boolean;
};

// ---------------------------------------------------------------------------
// Modelos guardados no aparelho
// ---------------------------------------------------------------------------

/** Resposta com CÓPIA de valor, peso e área do momento (RN11). */
export type StoredAnswer = {
  optionId: string;
  value: number;
  weight: number;
  areaCode: string;
  answeredAt: string;
};

export type StoredAreaResult = {
  code: string;
  points: number;
  maxPoints: number;
  /** 2 casas decimais. */
  percent: number;
  qtdSempre: number;
  position: number;
  principal: boolean;
};

export type StoredResult = {
  areas: StoredAreaResult[];
  hybrid: boolean;
  inDiscovery: boolean;
  uniformAnswers: boolean;
};

export type StoredAssessment = {
  id: string;
  status: 'EM_ANDAMENTO' | 'CONCLUIDA';
  startedAt: string;
  completedAt?: string;
  /** Códigos das perguntas na ordem EMBARALHADA, sorteada uma vez por avaliação (RN04/RN14). */
  order: string[];
  /** Posição atual (para retomar de onde parou). */
  index: number;
  answers: Record<string, StoredAnswer>;
  result?: StoredResult;
  /** Reservado: o sistema de favoritos ainda não existe. */
  favorite?: boolean;
};

export type UserStore = {
  version: 1;
  inProgress: StoredAssessment | null;
  /** Avaliações concluídas, da mais antiga para a mais recente. */
  history: StoredAssessment[];
};

/** Resumo de uma avaliação concluída para o cartão do Histórico. */
export type HistoryItem = {
  id: string;
  completedAt: string;
  /** Nome(s) da(s) área(s) principal(is). */
  title: string;
  /** Código(s) da(s) área(s) principal(is) — liga o resultado às trilhas recomendadas. */
  areaCodes: string[];
  /** Maior afinidade (0–100). */
  percent: number;
  hybrid: boolean;
  favorite: boolean;
};

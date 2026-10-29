/**
 * MODELOS DE TRILHA
 * Trilha = lista ordenada de etapas de uma área. O progresso do usuário NÃO fica na trilha:
 * fica em `ProgressStore` (única fonte de verdade, por usuário), e as telas derivam tudo dele.
 */

export type TrailStepDef = {
  /** Identificador único e ESTÁVEL da etapa (o progresso é guardado por ele). */
  id: string;
  title: string;
  /** Descrição curta (aparece na visão geral e no topo do conteúdo). */
  description: string;
  /** Texto da seção "Por que é importante?". */
  whyImportant: string;
  /** Tópicos da seção "O que você vai aprender?" (lista numerada). */
  topics: string[];
};

export type TrailDef = {
  id: string;
  /** Código da área (DEV, UX…) — liga o resultado da avaliação à trilha recomendada. */
  areaCode: string;
  name: string;
  areaName: string;
  /** Capa (URL). Sem ela, a interface mostra um quadrado provisório. */
  coverUrl?: string;
  /** Etapas em ordem. Quantidade livre (inclusive zero). */
  steps: TrailStepDef[];
};

/** trailId -> (stepId -> data/hora ISO da conclusão). Só existe entrada para etapas CONCLUÍDAS. */
export type ProgressStore = Record<string, Record<string, string>>;

export type TrailStore = { version: 1; progress: ProgressStore };

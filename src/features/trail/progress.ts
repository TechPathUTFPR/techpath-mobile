/**
 * Progresso da trilha: etapas concluídas ÷ total (todas com o mesmo peso).
 * ÚNICA função desse cálculo — Home, Minhas Trilhas, Visão Geral, Conteúdo da Etapa e
 * Etapa Concluída usam esta. Total 0 ou inválido => 0%.
 */
export function getTrailPercent(completedSteps: number, totalSteps: number): number {
  if (!Number.isFinite(totalSteps) || totalSteps <= 0) return 0;
  const ratio = Math.min(Math.max(completedSteps, 0), totalSteps) / totalSteps;
  return Math.round(ratio * 100);
}

export const isTrailFinished = (completedSteps: number, totalSteps: number) =>
  totalSteps > 0 && completedSteps >= totalSteps;

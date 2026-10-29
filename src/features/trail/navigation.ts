import type { useRouter } from 'expo-router';

type Router = ReturnType<typeof useRouter>;

/**
 * Rotas das trilhas (parâmetros por query):
 *   /trails                                  Minhas Trilhas
 *   /trail-overview?trailId=…                Visão Geral da Trilha
 *   /trail-step?trailId=…&stepId=…           Conteúdo da Etapa
 *   /trail-progress?trailId=…&stepId=…       Etapa Concluída
 */
export const openTrail = (router: Router, trailId: string) =>
  router.push({ pathname: '/trail-overview', params: { trailId } });

export const openStep = (router: Router, trailId: string, stepId: string) =>
  router.push({ pathname: '/trail-step', params: { trailId, stepId } });

/** Troca a tela atual (mantém a pilha curta: voltar leva à Visão Geral, não a etapas antigas). */
export const replaceWithStep = (router: Router, trailId: string, stepId: string) =>
  router.replace({ pathname: '/trail-step', params: { trailId, stepId } });

export const replaceWithProgress = (router: Router, trailId: string, stepId: string) =>
  router.replace({ pathname: '/trail-progress', params: { trailId, stepId } });

/** Lê um parâmetro de rota (pode vir como lista). */
export const firstParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

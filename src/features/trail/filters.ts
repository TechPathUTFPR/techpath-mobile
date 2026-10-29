import { MyTrail } from './trailModel';

export type TrailFilter = 'todos' | 'favoritos' | 'recentes';

const time = (iso: string) => {
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
};

/**
 * - todos:     todas as trilhas do usuário, na ordem em que foram recomendadas (mais antiga primeiro)
 * - favoritos: só as favoritas (o sistema de favoritos ainda não existe => vazio)
 * - recentes:  CRITÉRIO DOCUMENTADO: data da última atividade (etapa concluída ou, sem progresso,
 *              a data da recomendação), da mais recente para a mais antiga
 */
export function applyTrailFilter(trails: MyTrail[], filter: TrailFilter): MyTrail[] {
  switch (filter) {
    case 'favoritos':
      return trails.filter((t) => t.favorite);
    case 'recentes':
      return [...trails].sort((a, b) => time(b.lastActivityAt) - time(a.lastActivityAt));
    default:
      return [...trails];
  }
}

export function emptyTrailMessage(filter: TrailFilter): string {
  if (filter === 'favoritos') {
    return 'Você ainda não tem trilhas favoritas. A função de favoritar ainda não está disponível.';
  }
  return 'Você ainda não tem trilhas. Faça uma avaliação para receber a trilha da sua área.';
}

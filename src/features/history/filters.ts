import { HistoryItem } from '../assessment/types';

export type HistoryFilter = 'todos' | 'favoritos' | 'recentes';

/**
 * - todos:     todos os resultados do usuário, na ordem em que foram concluídos (mais antigo primeiro)
 * - favoritos: só os marcados como favoritos (o sistema de favoritos ainda não existe => lista vazia)
 * - recentes:  ordenados por data, do mais recente para o mais antigo
 */
export function applyHistoryFilter(history: HistoryItem[], filter: HistoryFilter): HistoryItem[] {
  switch (filter) {
    case 'favoritos':
      return history.filter((h) => h.favorite);
    case 'recentes':
      return [...history].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    default:
      return [...history];
  }
}

export function emptyMessage(filter: HistoryFilter): string {
  if (filter === 'favoritos') {
    return 'Você ainda não tem resultados favoritos. A função de favoritar ainda não está disponível.';
  }
  return 'Você ainda não fez nenhuma avaliação. Toque em "Nova Avaliação" para começar.';
}

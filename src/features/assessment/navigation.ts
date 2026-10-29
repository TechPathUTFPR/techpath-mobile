import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { getSession, getUserKey } from '../../services/session';
import { useAssessment } from './AssessmentContext';

/**
 * Para onde ir depois de entrar (e ao "sair" das telas de avaliação):
 *   - sem sessão                        -> /login
 *   - usuário SEM resultados salvos     -> /landing  (primeira vez / sem trilha definida)
 *   - usuário COM resultados salvos     -> /home     (Home)
 */
export function useGoToStart() {
  const router = useRouter();
  const { init } = useAssessment();
  return useCallback(async () => {
    const session = await getSession().catch(() => null);
    if (!session) {
      router.replace('/login');
      return;
    }
    const info = await init(getUserKey(session));
    router.replace(info.historyCount > 0 ? '/home' : '/landing');
  }, [router, init]);
}

/** Confirma antes de sair; nada é descartado em silêncio. */
export function confirmLeave(options: { title: string; message: string; onConfirm: () => void }) {
  Alert.alert(options.title, options.message, [
    { text: 'Continuar', style: 'cancel' },
    { text: 'Sair', style: 'destructive', onPress: options.onConfirm },
  ]);
}

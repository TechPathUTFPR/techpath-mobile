import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';

type Router = ReturnType<typeof useRouter>;

/**
 * Evita abrir duas vezes a mesma tela com toques rápidos: só executa a primeira
 * navegação e destrava quando a tela volta a ficar em foco.
 */
export function useNavigateOnce() {
  const router = useRouter();
  const locked = useRef(false);

  useFocusEffect(
    useCallback(() => {
      locked.current = false;
    }, []),
  );

  return useCallback(
    (navigate: (router: Router) => void) => {
      if (locked.current) return;
      locked.current = true;
      navigate(router);
    },
    [router],
  );
}

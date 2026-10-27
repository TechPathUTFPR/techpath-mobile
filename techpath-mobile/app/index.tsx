import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { getSession } from '../src/services/session';
import { colors } from '../src/theme/tokens';

/**
 * Ponto de entrada do app:
 *  - sessão ativa (real ou simulada) -> /home (não mostra a Landing de novo);
 *  - sem sessão                       -> /landing (início da apresentação).
 * Não há "primeira utilização" persistida: sem sessão, a Landing aparece.
 */
export default function Index() {
  const [target, setTarget] = useState<'/home' | '/landing' | null>(null);

  useEffect(() => {
    let active = true;
    getSession()
      .then((session) => active && setTarget(session ? '/home' : '/landing'))
      .catch(() => active && setTarget('/landing'));
    return () => {
      active = false;
    };
  }, []);

  if (!target) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  return <Redirect href={target} />;
}

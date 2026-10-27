import { Alert } from 'react-native';
import { signOut } from '../services/session';

/** Pede confirmação, encerra a sessão de verdade e só então chama `onSignedOut`. */
export function confirmSignOut(onSignedOut: () => void): void {
  Alert.alert('Sair da conta', 'Deseja realmente sair?', [
    { text: 'Cancelar', style: 'cancel' },
    {
      text: 'Sair',
      style: 'destructive',
      onPress: async () => {
        try {
          await signOut();
          onSignedOut();
        } catch {
          Alert.alert('Não foi possível sair', 'Ocorreu um erro ao encerrar a sessão. Tente novamente.');
        }
      },
    },
  ]);
}

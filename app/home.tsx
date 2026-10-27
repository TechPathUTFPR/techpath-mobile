import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSession } from '../src/services/session';
import { colors } from '../src/theme/tokens';
import { confirmSignOut } from '../src/utils/confirmSignOut';

/**
 * TELA TEMPORÁRIA pós-login/cadastro.
 * Confirma que a sessão foi criada e leva ao Meu Perfil. Será substituída pela
 * tela inicial real quando o layout do Figma for enviado.
 */
export default function HomeScreen() {
  const router = useRouter();
  const [simulated, setSimulated] = useState<boolean | null>(null);

  useEffect(() => {
    getSession()
      .then((session) => setSimulated(session?.simulated ?? false))
      .catch(() => setSimulated(null));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Sessão iniciada</Text>
        {simulated ? (
          <Text style={styles.simulated}>
            MODO SIMULADO: este login não foi autenticado em servidor algum. Qualquer e-mail com "@" e senha de 8+
            caracteres entra.
          </Text>
        ) : (
          <Text style={styles.text}>Autenticado no backend. O token de acesso foi salvo com segurança no aparelho.</Text>
        )}
        <Text style={styles.text}>Tela inicial ainda não implementada.</Text>
        <Pressable onPress={() => router.push('/profile')} style={styles.button} accessibilityRole="button">
          <Text style={styles.buttonText}>Meu Perfil</Text>
        </Pressable>
        <Pressable
          onPress={() => confirmSignOut(() => router.replace('/login'))}
          style={[styles.button, styles.buttonOutline]}
          accessibilityRole="button"
        >
          <Text style={[styles.buttonText, styles.buttonOutlineText]}>Sair</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  text: { fontSize: 14, color: colors.textStrong, textAlign: 'center' },
  simulated: { fontSize: 13, color: colors.error, textAlign: 'center', fontWeight: '600' },
  button: { height: 44, borderRadius: 8, backgroundColor: colors.buttonPrimaryBg, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: colors.buttonPrimaryText, fontWeight: '600', fontSize: 14 },
  buttonOutline: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.inputBorder },
  buttonOutlineText: { color: colors.textPrimary },
});

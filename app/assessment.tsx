import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { useNavigateOnce } from '../src/hooks/useNavigateOnce';
import { colors } from '../src/theme/tokens';

/**
 * TELA TEMPORÁRIA — o questionário de avaliação AINDA NÃO FOI IMPLEMENTADO.
 * É o destino de "Começar minha Avaliação" (rota /assessment). Não gera nenhum
 * resultado. Será substituída pela primeira pergunta quando o Figma chegar.
 * O botão "Ir para o Login" é uma ponte provisória para testar o resto do app.
 */
export default function AssessmentScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Avaliação de perfil</Text>
        <Text style={styles.text}>
          O questionário ainda não foi implementado, então nenhum resultado é gerado. Esta tela é
          provisória e será substituída pelo questionário real.
        </Text>
        <Button label="Ir para o Login" onPress={() => navigateOnce((r) => r.push('/login'))} />
        <Button
          label="Voltar"
          variant="secondary"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/landing'))}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  text: { fontSize: 14, color: colors.textStrong, textAlign: 'center' },
});

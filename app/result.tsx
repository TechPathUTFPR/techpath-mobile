import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AffinityCard } from '../src/components/AffinityCard';
import { BrandHeader } from '../src/components/BrandHeader';
import { Button } from '../src/components/Button';
import { ResultNotices } from '../src/components/ResultNotices';
import { SimulatedBadge } from '../src/components/SimulatedBadge';
import { StateMessage } from '../src/components/StateMessage';
import { useAssessment, useAssessmentBootstrap } from '../src/features/assessment/AssessmentContext';
import { splitAreas } from '../src/features/assessment/logic';
import { confirmLeave, useGoToStart } from '../src/features/assessment/navigation';
import { trailForArea } from '../src/data/trails';
import { openTrail } from '../src/features/trail/navigation';
import { Alert } from 'react-native';
import { useNavigateOnce } from '../src/hooks/useNavigateOnce';
import { getSession } from '../src/services/session';
import { resultLayout as L } from '../src/theme/screens';
import { colors } from '../src/theme/tokens';
import { firstName } from '../src/utils/userName';

/**
 * Resultado resumido. Lê o resultado que já está no AssessmentContext — abrir ou
 * voltar a esta tela NUNCA recalcula nada. Sem resultado (algoritmo pendente),
 * explica o motivo e oferece dados simulados claramente identificados.
 */
export default function ResultScreen() {
  const navigateOnce = useNavigateOnce();
  const goToStart = useGoToStart();
  useAssessmentBootstrap();
  const { result, state, loadDemoResult } = useAssessment();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    getSession()
      .then((session) => setName(firstName(session?.user?.name)))
      .catch(() => setName(null));
  }, []);

  const { principal } = splitAreas(result);

  const handleExit = () =>
    confirmLeave({
      title: 'Sair do resultado?',
      message: 'Seu resultado continua guardado enquanto o app estiver aberto.',
      onConfirm: goToStart,
    });

  // Abre a trilha recomendada para a área principal DESTE resultado.
  const handleTrail = () => {
    const trail = trailForArea(principal?.areaId);
    if (!trail) {
      Alert.alert('Trilha indisponível', 'Ainda não há uma trilha cadastrada para esta área.');
      return;
    }
    navigateOnce((r) => openTrail(r, trail.id));
  };

  if (!principal) {
    const answered = Object.keys(state.answers).length;
    const message =
      answered > 0
        ? 'Não há um resultado para exibir agora. Continue sua avaliação para ver o resultado.'
        : 'Você ainda não concluiu uma avaliação.';
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <BrandHeader onExit={handleExit} />
        <StateMessage title="Resultado indisponível" message={message}>
          <Button label="Ver exemplo com dados simulados" variant="secondary" onPress={loadDemoResult} />
          <Button label="Ir para o início" onPress={goToStart} />
        </StateMessage>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BrandHeader onExit={handleExit} />
      {result?.simulated ? <SimulatedBadge /> : null}

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title} accessibilityRole="header">
          {name ? `Parabéns, ${name}!` : 'Parabéns!'}
        </Text>
        <Text style={styles.subtitle}>Você concluiu a avaliação.</Text>
        <Text style={styles.intro}>Aqui está seu resultado.</Text>

        <View style={styles.card}>
          <AffinityCard
            areaName={principal.name}
            percent={principal.percent}
            description={principal.description}
            descriptionLines={3}
            imageUri={principal.imageUrl}
            minHeight={L.cardMinHeight}
          />
        </View>

        <View style={styles.notices}>
          <ResultNotices result={result} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Ver minha trilha de estudos" variant="brand" onPress={handleTrail} />
        <View style={{ height: L.footerGap }} />
        <Button label="Ver resultado completo" onPress={() => navigateOnce((r) => r.push('/result-details'))} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: L.margin, paddingBottom: 16 },
  title: {
    marginTop: L.titleTop,
    fontSize: L.titleFont,
    lineHeight: L.titleLine,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: L.subtitleTop,
    fontSize: L.subtitleFont,
    lineHeight: L.subtitleLine,
    color: colors.textPrimary,
  },
  intro: {
    marginTop: L.introTop,
    textAlign: 'center',
    fontSize: L.introFont,
    lineHeight: L.introLine,
    color: colors.textPrimary,
  },
  card: { marginTop: L.cardTop },
  notices: { marginTop: 12 },
  footer: { paddingHorizontal: L.footerPaddingHorizontal, paddingTop: 8, paddingBottom: L.footerPaddingBottom },
});

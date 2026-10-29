import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AffinityCard } from '../src/components/AffinityCard';
import { AffinityRow } from '../src/components/AffinityRow';
import { BrandHeader } from '../src/components/BrandHeader';
import { Button } from '../src/components/Button';
import { ResultNotices } from '../src/components/ResultNotices';
import { SimulatedBadge } from '../src/components/SimulatedBadge';
import { StateMessage } from '../src/components/StateMessage';
import { useAssessment, useAssessmentBootstrap } from '../src/features/assessment/AssessmentContext';
import { splitAreas } from '../src/features/assessment/logic';
import { trailForArea } from '../src/data/trails';
import { openTrail } from '../src/features/trail/navigation';
import { Alert } from 'react-native';
import { useNavigateOnce } from '../src/hooks/useNavigateOnce';
import { detailsLayout as L, resultLayout } from '../src/theme/screens';
import { colors } from '../src/theme/tokens';

/**
 * Resultado Completo: principal afinidade + "Outras áreas". Usa o MESMO objeto de
 * resultado da tela Resultado (via AssessmentContext), então os dados são idênticos.
 * Mostra quantas áreas vierem (sem limite) e rola sem esconder o botão.
 */
export default function ResultDetailsScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  useAssessmentBootstrap();
  const { result } = useAssessment();
  const { principal, others } = splitAreas(result);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/result');
  };

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
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <BrandHeader onBack={goBack} />
        <StateMessage title="Resultado indisponível" message="Não há um resultado de avaliação para exibir.">
          <Button label="Voltar" onPress={goBack} />
        </StateMessage>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BrandHeader onBack={goBack} />
      {result?.simulated ? <SimulatedBadge /> : null}

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <AffinityCard
            areaName={principal.name}
            percent={principal.percent}
            imageUri={principal.imageUrl}
          />
        </View>

        {principal.description ? <Text style={styles.description}>{principal.description}</Text> : null}

        <View style={styles.notices}>
          <ResultNotices result={result} />
        </View>

        <Text style={styles.section} accessibilityRole="header">
          Outras áreas
        </Text>
        {others.length > 0 ? (
          <View style={styles.rows}>
            {others.map((area) => (
              <AffinityRow key={area.areaId} name={area.name} percent={area.percent} />
            ))}
          </View>
        ) : (
          <Text style={styles.empty}>
            Nenhuma outra área foi avaliada neste resultado.
          </Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Ver minha trilha de estudos" variant="brand" onPress={handleTrail} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 16 },
  card: { marginTop: L.cardTop, marginHorizontal: L.cardMargin },
  notices: { marginTop: 16, marginHorizontal: L.descriptionMargin },
  description: {
    marginTop: L.descriptionTop,
    marginHorizontal: L.descriptionMargin,
    fontSize: L.descriptionFont,
    lineHeight: L.descriptionLine,
    color: colors.textPrimary,
  },
  section: {
    marginTop: L.sectionTop,
    marginHorizontal: L.descriptionMargin,
    fontSize: L.sectionFont,
    lineHeight: L.sectionLine,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  rows: { marginTop: L.rowsTop, marginHorizontal: L.descriptionMargin, gap: L.rowGap },
  empty: {
    marginTop: L.rowsTop,
    marginHorizontal: L.descriptionMargin,
    fontSize: 13,
    color: colors.textStrong,
  },
  footer: {
    paddingHorizontal: resultLayout.footerPaddingHorizontal,
    paddingTop: 8,
    paddingBottom: resultLayout.footerPaddingBottom,
  },
});

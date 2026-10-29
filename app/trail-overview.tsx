import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AreaImage } from '../src/components/AffinityCard';
import { BrandHeader } from '../src/components/BrandHeader';
import { Button } from '../src/components/Button';
import { ProgressBar } from '../src/components/ProgressBar';
import { SampleContentBadge } from '../src/components/SampleContentBadge';
import { StateMessage } from '../src/components/StateMessage';
import { TimelineStep } from '../src/components/TimelineStep';
import { useAssessmentBootstrap } from '../src/features/assessment/AssessmentContext';
import { firstParam, openStep } from '../src/features/trail/navigation';
import { useTrails } from '../src/features/trail/TrailContext';
import { useNavigateOnce } from '../src/hooks/useNavigateOnce';
import { brandColors, overviewLayout as L, resultLayout } from '../src/theme/screens';
import { colors } from '../src/theme/tokens';

/**
 * Visão Geral da Trilha (rota /trail-overview?trailId=…). Mostra a trilha selecionada com os
 * dados reais do progresso (TrailContext): % , "X de N etapas" e a linha do tempo com os
 * estados concluída / atual / futura. Qualquer quantidade de etapas; a lista rola.
 */
export default function TrailOverviewScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const params = useLocalSearchParams<{ trailId?: string | string[] }>();
  const trailId = firstParam(params.trailId);
  const ready = useAssessmentBootstrap();
  const { ready: trailsReady, getView } = useTrails();

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/trails');
  };

  const view = ready && trailsReady ? getView(trailId) : null;

  if (!ready || !trailsReady) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <BrandHeader onBack={goBack} />
        <StateMessage loading message="Carregando trilha…" />
      </SafeAreaView>
    );
  }
  if (!view) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <BrandHeader onBack={goBack} />
        <StateMessage title="Trilha indisponível" message="Não encontramos esta trilha.">
          <Button label="Voltar" onPress={goBack} />
        </StateMessage>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BrandHeader onBack={goBack} />
      <SampleContentBadge />

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title} accessibilityRole="header">
          Sua trilha de estudos
        </Text>

        <View style={styles.areaCard}>
          <Text style={styles.areaName}>{view.trail.areaName}</Text>
          <AreaImage uri={view.trail.coverUrl} />
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.progressText}>Seu progresso</Text>
          <Text style={styles.progressText}>{view.percent}%</Text>
        </View>
        <View style={{ marginTop: L.barTop }}>
          <ProgressBar percent={view.percent} height={L.barHeight} />
        </View>
        <Text style={styles.count}>
          {view.completedCount} de {view.total} {view.total === 1 ? 'etapa' : 'etapas'}
        </Text>

        <View style={styles.timeline}>
          {view.total === 0 ? (
            <Text style={styles.empty}>Esta trilha ainda não tem etapas.</Text>
          ) : (
            view.steps.map((item, i) => (
              <TimelineStep
                key={item.step.id}
                item={item}
                isLast={i === view.steps.length - 1}
                onPress={() => navigateOnce((r) => openStep(r, view.trail.id, item.step.id))}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: L.margin, paddingBottom: 24 },
  title: {
    marginTop: L.titleTop,
    fontSize: L.titleFont,
    lineHeight: L.titleLine,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  areaCard: {
    marginTop: L.cardTop,
    borderRadius: resultLayout.cardRadius,
    backgroundColor: brandColors.lilac,
    paddingVertical: L.cardPaddingVertical,
    paddingHorizontal: L.cardPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  areaName: {
    flex: 1,
    fontSize: resultLayout.nameFont,
    lineHeight: resultLayout.nameLine,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  progressRow: { marginTop: L.progressTop, flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: L.progressFont, lineHeight: L.progressLine, color: colors.textPrimary },
  count: { marginTop: L.countTop, fontSize: L.countFont, lineHeight: L.countLine, color: colors.textPrimary },
  timeline: { marginTop: L.timelineTop },
  empty: { fontSize: 14, color: colors.textStrong, textAlign: 'center', paddingVertical: 24 },
});

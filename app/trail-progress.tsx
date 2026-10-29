import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandHeader } from '../src/components/BrandHeader';
import { Button } from '../src/components/Button';
import { CompletionBadge } from '../src/components/icons';
import { NextStepCard } from '../src/components/NextStepCard';
import { ProgressBar } from '../src/components/ProgressBar';
import { SampleContentBadge } from '../src/components/SampleContentBadge';
import { StateMessage } from '../src/components/StateMessage';
import { useAssessmentBootstrap } from '../src/features/assessment/AssessmentContext';
import { firstParam, replaceWithStep } from '../src/features/trail/navigation';
import { nextPendingStep } from '../src/features/trail/trailModel';
import { useTrails } from '../src/features/trail/TrailContext';
import { assessmentColors, trailLayout as L } from '../src/theme/screens';
import { colors } from '../src/theme/tokens';

/**
 * Etapa Concluída (rota /trail-progress?trailId=…&stepId=…). Aparece depois de "Marcar como concluído".
 * Lê o MESMO progresso das outras telas (TrailContext); só diz "Etapa Concluída!" se a etapa do
 * parâmetro estiver realmente concluída no progresso salvo.
 */
export default function TrailProgressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ trailId?: string | string[]; stepId?: string | string[] }>();
  const trailId = firstParam(params.trailId);
  const stepId = firstParam(params.stepId);
  const ready = useAssessmentBootstrap();
  const { ready: trailsReady, getView } = useTrails();

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else if (trailId) router.replace({ pathname: '/trail-overview', params: { trailId } });
    else router.replace('/trails');
  };

  if (!ready || !trailsReady) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <BrandHeader onBack={goBack} />
        <StateMessage loading message="Carregando…" />
      </SafeAreaView>
    );
  }

  const view = getView(trailId);
  const completedItem = view?.steps.find((s) => s.step.id === stepId && s.state === 'completed') ?? null;

  if (!view || !completedItem) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <BrandHeader onBack={goBack} />
        <StateMessage
          title="Nenhuma etapa concluída"
          message="Não há uma etapa concluída para exibir. Esta tela só aparece quando uma etapa é marcada como concluída."
        >
          <Button label="Voltar" onPress={goBack} />
        </StateMessage>
      </SafeAreaView>
    );
  }

  const next = nextPendingStep(view, completedItem.step.id);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BrandHeader onBack={goBack} />
      <SampleContentBadge />

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title} accessibilityRole="header">
          Etapa Concluída!
        </Text>

        <View style={styles.badge}>
          <CompletionBadge
            outer={L.circleOuter}
            inner={L.circleInner}
            outerColor={assessmentColors.circleOuter}
            innerColor={assessmentColors.circleInner}
            checkColor={assessmentColors.check}
          />
        </View>

        <Text style={styles.message}>
          {view.finished
            ? `Você concluiu todas as etapas da sua jornada de\n${view.trail.areaName}!`
            : `Você deu mais um passo na sua jornada de\n${view.trail.areaName}!`}
        </Text>

        {next ? (
          <>
            <Text style={styles.nextLabel}>Próxima etapa</Text>
            <View style={styles.nextCard}>
              <NextStepCard
                step={{ id: next.step.id, order: next.order, name: next.step.title, description: next.step.description }}
                onPress={() => replaceWithStep(router, view.trail.id, next.step.id)}
              />
            </View>
          </>
        ) : null}

        <View style={[styles.progressRow, { marginTop: next ? L.progressTop : 60 }]}>
          <Text style={styles.progressText}>Seu progresso na trilha</Text>
          <Text style={styles.progressText}>{view.percent}%</Text>
        </View>
        <View style={styles.bar}>
          <ProgressBar percent={view.percent} height={L.barHeight} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Ver minha trilha de estudos" variant="brand" onPress={goBack} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 16 },
  title: {
    marginTop: L.titleTop,
    textAlign: 'center',
    fontSize: L.titleFont,
    lineHeight: L.titleLine,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  badge: { marginTop: L.circleTop, alignItems: 'center' },
  message: {
    marginTop: L.textTop,
    paddingHorizontal: 24,
    textAlign: 'center',
    fontSize: L.textFont,
    lineHeight: L.textLine,
    color: colors.textPrimary,
  },
  nextLabel: {
    marginTop: L.nextTop,
    marginLeft: L.labelMargin,
    fontSize: L.labelFont,
    lineHeight: L.labelLine,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  nextCard: { marginTop: L.cardTop, marginHorizontal: L.cardMargin },
  progressRow: { marginHorizontal: L.progressMargin, flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: L.progressFont, lineHeight: L.progressLine, color: colors.textPrimary },
  bar: { marginTop: L.barTop, marginHorizontal: L.barMargin },
  footer: { paddingHorizontal: L.footerPaddingHorizontal, paddingTop: 8, paddingBottom: L.footerPaddingBottom },
});

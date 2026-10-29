import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandHeader } from '../src/components/BrandHeader';
import { Button } from '../src/components/Button';
import { SampleContentBadge } from '../src/components/SampleContentBadge';
import { StateMessage } from '../src/components/StateMessage';
import { StepBadge } from '../src/components/StepBadge';
import { useAssessmentBootstrap } from '../src/features/assessment/AssessmentContext';
import { firstParam, replaceWithProgress, replaceWithStep } from '../src/features/trail/navigation';
import { previousStep } from '../src/features/trail/trailModel';
import { useTrails } from '../src/features/trail/TrailContext';
import { stepLayout as L } from '../src/theme/screens';
import { colors } from '../src/theme/tokens';

/**
 * Conteúdo da Etapa (rota /trail-step?trailId=…&stepId=…) — UMA tela para todas as etapas e trilhas.
 * Os dados vêm do TrailContext pelos ids da rota. "Marcar como concluído" grava ANTES de mudar o
 * estado; se falhar, nada é marcado. Abrir a etapa nunca a conclui.
 */
export default function TrailStepScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ trailId?: string | string[]; stepId?: string | string[] }>();
  const trailId = firstParam(params.trailId);
  const stepId = firstParam(params.stepId);
  const ready = useAssessmentBootstrap();
  const { ready: trailsReady, getView, completeStep } = useTrails();

  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else if (trailId) router.replace({ pathname: '/trail-overview', params: { trailId } });
    else router.replace('/trails');
  };

  const view = ready && trailsReady ? getView(trailId) : null;
  const item = view?.steps.find((s) => s.step.id === stepId) ?? null;

  if (!ready || !trailsReady) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <BrandHeader onBack={goBack} />
        <StateMessage loading message="Carregando etapa…" />
      </SafeAreaView>
    );
  }
  if (!view || !item) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <BrandHeader onBack={goBack} />
        <StateMessage title="Etapa indisponível" message="Não encontramos esta etapa.">
          <Button label="Voltar" onPress={goBack} />
        </StateMessage>
      </SafeAreaView>
    );
  }

  const { step } = item;
  const previous = previousStep(view, step.id);
  const completed = item.state === 'completed';

  const handlePrevious = () => {
    if (previous) replaceWithStep(router, view.trail.id, previous.step.id);
  };

  const handleComplete = async () => {
    if (savingRef.current || completed) return; // sem duplicar
    savingRef.current = true;
    setSaving(true);
    try {
      const result = await completeStep(view.trail.id, step.id);
      if (!result.ok) {
        Alert.alert('Não foi possível concluir', result.error);
        return;
      }
      if (!result.alreadyCompleted) replaceWithProgress(router, view.trail.id, step.id);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BrandHeader onBack={goBack} />
      <SampleContentBadge />

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: L.badgeTop }}>
          <StepBadge label={`Etapa ${item.order} de ${view.total}`} />
        </View>

        <Text style={styles.title} accessibilityRole="header">
          {step.title}
        </Text>
        {step.description ? <Text style={styles.description}>{step.description}</Text> : null}

        <Text style={[styles.heading, { marginTop: L.sectionTop }]} accessibilityRole="header">
          Por que é importante?
        </Text>
        <View style={styles.box}>
          <Text style={styles.boxText}>{step.whyImportant || 'Conteúdo ainda não cadastrado.'}</Text>
        </View>

        <Text style={[styles.heading, { marginTop: L.section2Top }]} accessibilityRole="header">
          O que você vai aprender?
        </Text>
        <View style={[styles.box, styles.listBox]}>
          {step.topics.length > 0 ? (
            step.topics.map((topic, i) => (
              <Text key={`${i}-${topic}`} style={styles.listItem}>
                {i + 1}. {topic}
              </Text>
            ))
          ) : (
            <Text style={styles.boxText}>Conteúdo ainda não cadastrado.</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {/* Na primeira etapa não existe etapa anterior: botão desabilitado. */}
        <Button label="Voltar para a etapa anterior" variant="brand" onPress={handlePrevious} disabled={!previous} />
        <View style={{ height: L.footerGap }} />
        <Button
          label={completed ? 'Etapa concluída' : 'Marcar como concluído'}
          onPress={handleComplete}
          loading={saving}
          disabled={completed}
        />
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
  description: {
    marginTop: L.descTop,
    fontSize: L.descFont,
    lineHeight: L.descLine,
    color: colors.textPrimary,
  },
  heading: {
    fontSize: L.headingFont,
    lineHeight: L.headingLine,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  box: {
    marginTop: L.boxTop,
    minHeight: L.boxMinHeight,
    borderRadius: L.boxRadius,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.background,
    padding: L.boxPadding,
  },
  listBox: { minHeight: 0, paddingVertical: L.listPaddingVertical },
  boxText: { fontSize: L.boxFont, lineHeight: L.boxLine, color: colors.textPrimary },
  listItem: { fontSize: L.listFont, lineHeight: L.listLine, fontWeight: '500', color: colors.textPrimary },
  footer: {
    paddingHorizontal: L.footerPaddingHorizontal,
    paddingTop: L.footerPaddingTop,
    paddingBottom: L.footerPaddingBottom,
  },
});

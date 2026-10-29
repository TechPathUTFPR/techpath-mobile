import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { LogoHorizontal } from '../src/components/LogoHorizontal';
import { StepCard } from '../src/components/StepCard';
import { useAssessment, useAssessmentBootstrap } from '../src/features/assessment/AssessmentContext';
import { useNavigateOnce } from '../src/hooks/useNavigateOnce';
import { brandColors, howItWorksLayout as L } from '../src/theme/screens';
import { colors, layout } from '../src/theme/tokens';

/** Segunda tela de apresentação. "Começar minha Avaliação" → /assessment (questionário). */
export default function HowItWorksScreen() {
  const navigateOnce = useNavigateOnce();
  useAssessmentBootstrap();
  const { hasInProgress } = useAssessment();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Conteúdo rola se não couber; o botão fica fixo embaixo e nunca é escondido. */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoWrap}>
          <LogoHorizontal />
        </View>

        <Text style={styles.subtitle}>Como Funciona</Text>
        <Text style={styles.title} accessibilityRole="header">
          {'Em poucos passos\nvocê descobre\nseu caminho na tecnologia'}
        </Text>

        <View style={styles.sections}>
          <StepCard
            label="Responda"
            text="Responda um questionário com perguntas sobre suas habilidades, interesses e preferências."
          />
          <StepCard
            label="Descubra"
            text="Receba um ranking de áreas de TI que mais combinam com o seu perfil, com base nas suas respostas."
          />
          <StepCard
            label="Siga"
            text="Receba uma trilha de estudos personalizada, com as principais competências para você evoluir na área."
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={hasInProgress ? 'Continuar minha Avaliação' : 'Começar minha Avaliação'}
          variant="brand"
          onPress={() => navigateOnce((r) => r.push('/assessment'))}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: brandColors.lilac },
  content: { paddingTop: L.logoTop, paddingBottom: 8 },
  logoWrap: { alignItems: 'center' },
  subtitle: {
    marginTop: L.subtitleTop,
    textAlign: 'center',
    fontSize: L.subtitleFontSize,
    lineHeight: L.subtitleLineHeight,
    color: brandColors.textSoft,
  },
  title: {
    marginTop: L.titleTop,
    paddingHorizontal: layout.screenPaddingHorizontal,
    textAlign: 'center',
    fontSize: L.titleFontSize,
    lineHeight: L.titleLineHeight,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sections: { marginTop: L.sectionsTop },
  footer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 8,
    paddingBottom: L.footerPaddingBottom,
  },
});

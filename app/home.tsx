import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionCard } from '../src/components/ActionCard';
import { BrandHeader } from '../src/components/BrandHeader';
import { LastResultCard } from '../src/components/LastResultCard';
import { StateMessage } from '../src/components/StateMessage';
import { useAssessment, useAssessmentBootstrap } from '../src/features/assessment/AssessmentContext';
import { openTrail } from '../src/features/trail/navigation';
import { useTrails } from '../src/features/trail/TrailContext';
import { useNavigateOnce } from '../src/hooks/useNavigateOnce';
import { getSession } from '../src/services/session';
import { homeLayout as L } from '../src/theme/screens';
import { colors } from '../src/theme/tokens';
import { firstName } from '../src/utils/userName';

/**
 * Home autenticada. Tudo vem do usuário logado:
 *  - nome: sessão;  último resultado: histórico de avaliações (AssessmentContext);
 *  - "Continuar trilha": progresso das trilhas (TrailContext, a mesma fonte das outras telas).
 * Atualiza sozinha quando uma avaliação termina ou uma etapa é concluída.
 *
 * Acesso ao Perfil: botão (avatar) no canto superior direito do cabeçalho; a saudação também abre o perfil.
 */
export default function HomeScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const ready = useAssessmentBootstrap();
  const { history, loadError, openHistoryResult } = useAssessment();
  const { ready: trailsReady, myTrails, continueTrail } = useTrails();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    getSession()
      .then((session) => setName(firstName(session?.user?.name)))
      .catch(() => setName(null));
  }, []);

  const latest = useMemo(
    () => [...history].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0] ?? null,
    [history],
  );

  const startAssessment = () => navigateOnce((r) => r.push('/how-it-works'));

  const seeResult = () => {
    if (latest && openHistoryResult(latest.id)) navigateOnce((r) => r.push('/result-details'));
  };

  const continueTrailPress = () => {
    if (continueTrail) {
      const id = continueTrail.trail.id;
      navigateOnce((r) => openTrail(r, id));
    } else if (myTrails.length > 0) {
      navigateOnce((r) => r.push('/trails')); // todas concluídas: mostra Minhas Trilhas
    } else {
      Alert.alert('Nenhuma trilha em andamento', 'Faça uma avaliação para receber a trilha da sua área.');
    }
  };

  let body;
  if (!ready || !trailsReady) {
    body = <StateMessage loading message="Carregando…" />;
  } else if (loadError) {
    body = <StateMessage title="Não foi possível carregar seus dados" message={loadError} />;
  } else {
    body = (
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.push('/profile')} accessibilityRole="button" accessibilityLabel="Abrir meu perfil">
          <Text style={styles.greeting} accessibilityRole="header">
            {name ? `Olá, ${name}!` : 'Olá!'}
          </Text>
          <Text style={styles.subtitle}>Continue explorando seu caminho.</Text>
        </Pressable>

        <View style={styles.card}>
          {latest ? (
            <LastResultCard
              areaName={latest.title}
              percent={latest.percent}
              dateIso={latest.completedAt}
              onPress={seeResult}
            />
          ) : (
            <LastResultCard empty onPress={startAssessment} />
          )}
        </View>

        <Text style={styles.heading}>O que você quer fazer agora?</Text>
        <View style={styles.actions}>
          <ActionCard title="Nova avaliação" description="Descubra se seu perfil mudou" onPress={startAssessment} />
          <ActionCard
            title="Continuar trilha"
            description={continueTrail ? 'Continue sua jornada de estudos' : 'Nenhuma trilha em andamento'}
            onPress={continueTrailPress}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BrandHeader onProfile={() => navigateOnce((r) => r.push('/profile'))} />
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: L.margin, paddingBottom: L.bottomPadding },
  greeting: {
    marginTop: L.greetingTop,
    fontSize: L.greetingFont,
    lineHeight: L.greetingLine,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: L.subtitleTop,
    fontSize: L.subtitleFont,
    lineHeight: L.subtitleLine,
    color: colors.textPrimary,
  },
  card: { marginTop: L.cardTop },
  heading: {
    marginTop: L.headingTop,
    fontSize: L.headingFont,
    lineHeight: L.headingLine,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actions: { marginTop: L.actionsTop, flexDirection: 'row', gap: L.actionGap },
});

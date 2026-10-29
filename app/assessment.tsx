import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandHeader } from '../src/components/BrandHeader';
import { Button } from '../src/components/Button';
import { CategoryTag } from '../src/components/CategoryTag';
import { OptionCard } from '../src/components/OptionCard';
import { ProgressBar } from '../src/components/ProgressBar';
import { StateMessage } from '../src/components/StateMessage';
import { useAssessment, useAssessmentBootstrap } from '../src/features/assessment/AssessmentContext';
import { getProgress, getSelected, isInProgress, isRequired } from '../src/features/assessment/logic';
import { confirmLeave, useGoToStart } from '../src/features/assessment/navigation';
import { assessmentLayout as L } from '../src/theme/screens';
import { colors, fontSizes } from '../src/theme/tokens';

const LEAVE_MESSAGE =
  'Suas respostas já foram salvas neste aparelho e você poderá continuar de onde parou. Deseja sair da avaliação?';

/**
 * Questionário DINÂMICO: uma única tela para qualquer quantidade de perguntas.
 * As perguntas (30 na v1) vêm do banco da especificação, embaralhadas UMA vez por avaliação.
 * A tela só recebe { id, enunciado, categoria, opções } — nunca área nem peso (RN05).
 * As respostas são salvas a cada passo (RN06) e a avaliação pode ser retomada (RN07).
 */
export default function AssessmentScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const goToStart = useGoToStart();
  const ready = useAssessmentBootstrap();
  const { loadError, storageError, state, begin, select, goNext, goBack } = useAssessment();

  const [began, setBegan] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const allowLeaveRef = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Dados prontos: inicia uma avaliação nova ou retoma a que estava em andamento.
  useEffect(() => {
    if (ready && !began) {
      begin();
      setBegan(true);
    }
  }, [ready, began, begin]);

  useEffect(() => {
    if (storageError) Alert.alert('Atenção', storageError);
  }, [storageError]);

  // A cada mudança de pergunta: volta ao topo e limpa o aviso.
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    setNotice(null);
  }, [state.index]);

  // Confirma antes de abandonar com respostas (seta do sistema, gesto ou botão do Android).
  useEffect(() => {
    return navigation.addListener('beforeRemove', (event) => {
      if (allowLeaveRef.current || !isInProgress(stateRef.current)) return;
      event.preventDefault();
      confirmLeave({
        title: 'Sair da avaliação?',
        message: LEAVE_MESSAGE,
        onConfirm: () => {
          allowLeaveRef.current = true;
          navigation.dispatch(event.data.action);
        },
      });
    });
  }, [navigation]);

  const handleExit = () => {
    const leave = () => {
      allowLeaveRef.current = true;
      goToStart();
    };
    if (isInProgress(stateRef.current)) {
      confirmLeave({ title: 'Sair da avaliação?', message: LEAVE_MESSAGE, onConfirm: leave });
    } else {
      leave();
    }
  };

  const handleNext = () => {
    const outcome = goNext();
    if (outcome === 'blocked') {
      setNotice('Selecione uma opção para continuar.');
      return;
    }
    setNotice(null);
    if (outcome === 'completed') {
      allowLeaveRef.current = true;
      router.replace('/result');
    }
  };

  const questions = state.questions;
  const question = questions[state.index];
  const progress = getProgress(state.index, questions.length);
  const isLast = state.index >= questions.length - 1;

  let body;
  if (!ready || !began) {
    body = <StateMessage loading message="Carregando perguntas…" />;
  } else if (loadError) {
    body = (
      <StateMessage title="Não foi possível carregar o questionário" message={loadError}>
        <Button label="Voltar ao início" onPress={goToStart} />
      </StateMessage>
    );
  } else if (!question) {
    body = (
      <StateMessage title="Nenhuma pergunta disponível" message="O questionário ainda não tem perguntas ativas.">
        <Button label="Voltar ao início" onPress={goToStart} />
      </StateMessage>
    );
  } else {
    const selected = getSelected(state.answers, question);
    const blockedNext = isRequired(question) && selected.length === 0;
    body = (
      <>
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginTop: L.progressTop }}>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                Pergunta {progress.current} de {progress.total}
              </Text>
              <Text style={styles.progressText}>{Math.round(progress.percent)}%</Text>
            </View>
            <View style={{ marginTop: L.barTop }}>
              <ProgressBar percent={progress.percent} height={L.barHeight} />
            </View>
          </View>

          <View style={{ marginTop: L.tagTop }}>
            <CategoryTag label={question.category} />
          </View>

          <Text style={styles.question} accessibilityRole="header">
            {question.text}
          </Text>

          <View style={styles.options}>
            {question.options.map((option) => (
              <OptionCard
                key={option.id}
                label={option.text}
                selected={selected.includes(option.id)}
                multiple={question.multiple}
                onPress={() => {
                  select(option.id);
                  setNotice(null);
                }}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {notice ? (
            <Text style={styles.notice} accessibilityRole="alert">
              {notice}
            </Text>
          ) : null}
          <View style={styles.buttons}>
            <View style={styles.flex}>
              <Button label="Voltar" onPress={goBack} disabled={state.index === 0} />
            </View>
            <View style={styles.flex}>
              {/* Parece desabilitado até escolher uma opção, mas o toque explica o motivo. */}
              <Button label={isLast ? 'Concluir' : 'Próxima'} onPress={handleNext} softDisabled={blockedNext} />
            </View>
          </View>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BrandHeader onExit={handleExit} />
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: L.marginHorizontal, paddingBottom: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: L.progressFont, lineHeight: L.progressLine, color: colors.textPrimary },
  question: {
    marginTop: L.questionTop,
    fontSize: L.questionFont,
    lineHeight: L.questionLine,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  options: { marginTop: L.optionsTop, gap: L.optionGap },
  footer: {
    paddingHorizontal: L.footerPaddingHorizontal,
    paddingTop: L.footerTop,
    paddingBottom: L.footerPaddingBottom,
  },
  notice: { marginBottom: 8, textAlign: 'center', fontSize: fontSizes.error, color: colors.error },
  buttons: { flexDirection: 'row', gap: L.footerGap },
});

import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { FilterChip } from '../src/components/FilterChip';
import { HistoryCard } from '../src/components/HistoryCard';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { StateMessage } from '../src/components/StateMessage';
import { useAssessment, useAssessmentBootstrap } from '../src/features/assessment/AssessmentContext';
import { HistoryFilter, applyHistoryFilter, emptyMessage } from '../src/features/history/filters';
import { useNavigateOnce } from '../src/hooks/useNavigateOnce';
import { historyLayout as L } from '../src/theme/screens';
import { colors } from '../src/theme/tokens';

const FILTERS: { key: HistoryFilter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'favoritos', label: 'Favoritos' },
  { key: 'recentes', label: 'Recentes' },
];

/**
 * Histórico de Resultados: avaliações concluídas do usuário autenticado (guardadas neste
 * aparelho; a especificação prevê GET /avaliacoes no backend). Toque em um cartão abre o
 * Resultado Completo daquela avaliação.
 */
export default function HistoryScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const { width } = useWindowDimensions();
  const ready = useAssessmentBootstrap();
  const { history, loadError, openHistoryResult } = useAssessment();
  const [filter, setFilter] = useState<HistoryFilter>('recentes');

  const data = useMemo(() => applyHistoryFilter(history, filter), [history, filter]);
  const cardWidth = Math.floor((width - 2 * L.gridMarginHorizontal - L.gridGap) / 2);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/home'); // tela provisória que dá acesso a Perfil e atalhos de teste
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScreenHeader title="Histórico de Resultados" onBack={goBack} />

      <View style={styles.chips}>
        {FILTERS.map((f) => (
          <FilterChip key={f.key} label={f.label} selected={filter === f.key} onPress={() => setFilter(f.key)} />
        ))}
      </View>

      {!ready ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </View>
      ) : loadError ? (
        <StateMessage title="Não foi possível carregar o histórico" message={loadError} />
      ) : (
        <FlatList
          style={styles.flex}
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: L.gridGap }}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <HistoryCard
              item={item}
              width={cardWidth}
              onPress={() => {
                if (openHistoryResult(item.id)) navigateOnce((r) => r.push('/result-details'));
              }}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>{emptyMessage(filter)}</Text>}
        />
      )}

      <View style={styles.footer}>
        <Button label="Nova Avaliação" compact onPress={() => navigateOnce((r) => r.push('/how-it-works'))} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  chips: {
    marginTop: L.chipsTop,
    marginHorizontal: L.chipsMarginHorizontal,
    flexDirection: 'row',
    gap: L.chipsGap,
  },
  grid: { paddingHorizontal: L.gridMarginHorizontal, paddingTop: L.gridTop, paddingBottom: 16, rowGap: L.rowGap },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { marginTop: 40, textAlign: 'center', fontSize: 14, color: colors.textStrong, paddingHorizontal: 8 },
  footer: { paddingTop: L.footerPaddingTop, paddingBottom: L.footerPaddingBottom },
});

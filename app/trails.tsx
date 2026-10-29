import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterChip } from '../src/components/FilterChip';
import { SampleContentBadge } from '../src/components/SampleContentBadge';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { TrailCard } from '../src/components/TrailCard';
import { useAssessmentBootstrap } from '../src/features/assessment/AssessmentContext';
import { TrailFilter, applyTrailFilter, emptyTrailMessage } from '../src/features/trail/filters';
import { openTrail } from '../src/features/trail/navigation';
import { useTrails } from '../src/features/trail/TrailContext';
import { useNavigateOnce } from '../src/hooks/useNavigateOnce';
import { historyLayout, trailsLayout as L } from '../src/theme/screens';
import { colors } from '../src/theme/tokens';

const FILTERS: { key: TrailFilter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'favoritos', label: 'Favoritos' },
  { key: 'recentes', label: 'Recentes' },
];

/**
 * Minhas Trilhas: as trilhas do usuário (recomendadas pelas avaliações concluídas).
 * Filtros: Todos (ordem de recomendação), Recentes (última atividade) e Favoritos
 * (ainda não existe sistema de favoritos: lista vazia com aviso).
 */
export default function TrailsScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const { width } = useWindowDimensions();
  const ready = useAssessmentBootstrap();
  const { ready: trailsReady, myTrails } = useTrails();
  const [filter, setFilter] = useState<TrailFilter>('todos');

  const data = useMemo(() => applyTrailFilter(myTrails, filter), [myTrails, filter]);
  const cardWidth = Math.floor((width - 2 * L.gridMarginHorizontal - L.gridGap) / 2);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScreenHeader title="Minhas Trilhas" onBack={goBack} />

      <View style={styles.chips}>
        {FILTERS.map((f) => (
          <FilterChip
            key={f.key}
            variant="filled"
            label={f.label}
            selected={filter === f.key}
            onPress={() => setFilter(f.key)}
          />
        ))}
      </View>
      <SampleContentBadge />

      {!ready || !trailsReady ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </View>
      ) : (
        <FlatList
          style={styles.flex}
          data={data}
          keyExtractor={(item) => item.trail.id}
          numColumns={2}
          columnWrapperStyle={{ gap: L.gridGap }}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TrailCard
              name={item.trail.name}
              coverUrl={item.trail.coverUrl}
              width={cardWidth}
              onPress={() => navigateOnce((r) => openTrail(r, item.trail.id))}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>{emptyTrailMessage(filter)}</Text>}
        />
      )}
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
    gap: historyLayout.chipsGap,
  },
  grid: { paddingHorizontal: L.gridMarginHorizontal, paddingTop: L.gridTop, paddingBottom: 24, rowGap: L.rowGap },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { marginTop: 40, textAlign: 'center', fontSize: 14, color: colors.textStrong, paddingHorizontal: 8 },
});

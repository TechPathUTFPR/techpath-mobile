import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HistoryItem } from '../features/assessment/types';
import { formatDate } from '../utils/format';
import { historyLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';

/**
 * Cartão do histórico: capa retangular + nome. A capa é um quadrado escuro PROVISÓRIO
 * (ainda não há capas de trilha no projeto); o texto vem do resultado de cada avaliação.
 */
export function HistoryCard({ item, width, onPress }: { item: HistoryItem; width: number; onPress: () => void }) {
  const date = formatDate(item.completedAt);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}${date ? `, ${date}` : ''}`}
      style={({ pressed }) => [{ width }, pressed && styles.pressed]}
    >
      <View style={[styles.cover, { width, height: width }]} />
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.meta}>
        {date ? `${date} · ` : ''}
        {Math.round(item.percent)}%
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.8 },
  cover: { backgroundColor: L.coverColor, borderRadius: 2 },
  title: {
    marginTop: L.captionTop,
    fontSize: L.captionFont,
    lineHeight: L.captionLine,
    color: colors.textPrimary,
  },
  meta: { fontSize: 12, lineHeight: 16, color: colors.textMuted },
});

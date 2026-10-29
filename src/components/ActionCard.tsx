import { Pressable, StyleSheet, Text } from 'react-native';
import { homeLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';

/** Cartão de ação da Home ("Nova avaliação", "Continuar trilha"): título + descrição curta. */
export function ActionCard({ title, description, onPress }: { title: string; description: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: L.actionHeight,
    borderRadius: L.actionRadius,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.background,
    paddingHorizontal: L.actionPaddingHorizontal,
    paddingTop: L.actionPaddingTop,
    paddingBottom: 8,
  },
  pressed: { backgroundColor: '#F7F7F7' },
  title: { fontSize: L.actionTitleFont, lineHeight: L.actionTitleLine, fontWeight: '600', color: colors.textPrimary },
  description: {
    marginTop: L.actionDescTop,
    fontSize: L.actionDescFont,
    lineHeight: L.actionDescLine,
    color: colors.textPrimary,
  },
});

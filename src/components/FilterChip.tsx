import { Pressable, StyleSheet, Text } from 'react-native';
import { brandColors, historyLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** outline = borda cinza (Histórico) | filled = fundo lilás (Minhas Trilhas). O selecionado ganha destaque nos dois. */
  variant?: 'outline' | 'filled';
};

export function FilterChip({ label, selected, onPress, variant = 'outline' }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Filtro ${label}`}
      style={[
        styles.chip,
        variant === 'filled' && styles.filled,
        selected && (variant === 'filled' ? styles.filledSelected : styles.selected),
      ]}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: L.chipHeight,
    paddingHorizontal: L.chipPaddingHorizontal,
    borderRadius: L.chipRadius,
    borderWidth: 1,
    borderColor: L.chipBorder,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  selected: { backgroundColor: L.chipSelectedBg, borderColor: L.chipSelectedBorder },
  filled: { backgroundColor: brandColors.lilac, borderColor: brandColors.lilac },
  filledSelected: { borderColor: brandColors.purple },
  text: { fontSize: L.chipFont, color: colors.textPrimary },
  textSelected: { fontWeight: '600' },
});

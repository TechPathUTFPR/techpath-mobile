import { Pressable, StyleSheet, Text } from 'react-native';
import { assessmentColors, assessmentLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** true = pergunta de várias respostas (acessibilidade: caixa de seleção em vez de rádio). */
  multiple?: boolean;
};

/** Alternativa do questionário: cartão branco com borda; selecionado = fundo lilás. */
export function OptionCard({ label, selected, onPress, multiple = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={multiple ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected, selected }}
      accessibilityLabel={label}
      style={[styles.card, selected && styles.selected]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: L.optionMinHeight,
    borderRadius: L.optionRadius,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.background,
    paddingHorizontal: L.optionPaddingHorizontal,
    paddingVertical: L.optionPaddingVertical,
  },
  selected: {
    backgroundColor: assessmentColors.optionSelected,
    borderColor: assessmentColors.optionSelected,
  },
  label: { fontSize: L.optionFont, fontWeight: '600', color: colors.textPrimary },
});

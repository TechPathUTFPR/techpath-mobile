import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';
import { registerLayout } from '../theme/screens';

/** Rótulo em negrito acima de um campo. `gap` = espaço abaixo do campo (padrão da tela Criar Conta). */
export function LabeledField({
  label,
  children,
  gap = registerLayout.fieldGap,
}: {
  label: string;
  children: ReactNode;
  gap?: number;
}) {
  return (
    <View style={{ marginBottom: gap }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: registerLayout.labelGap,
    fontSize: registerLayout.labelFontSize,
    lineHeight: registerLayout.labelLineHeight,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

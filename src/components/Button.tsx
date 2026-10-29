import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { brandColors, historyLayout } from '../theme/screens';
import { colors, fontSizes, layout } from '../theme/tokens';

type Props = {
  label: string;
  onPress: () => void;
  /** primary = preto | secondary = cinza-claro (Google) | brand = roxo (Landing/Como Funciona) */
  variant?: 'primary' | 'secondary' | 'brand';
  loading?: boolean;
  /** Desabilitado de verdade: não responde ao toque. */
  disabled?: boolean;
  /** Parece desabilitado mas AINDA recebe o toque (a tela explica por que não pode seguir). */
  softDisabled?: boolean;
  /** Botão compacto e centralizado (ex.: "Nova Avaliação"), em vez de largura total. */
  compact?: boolean;
  icon?: ReactNode;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  softDisabled = false,
  compact = false,
  icon,
}: Props) {
  const inactive = disabled || loading;
  const textColor = variant === 'secondary' ? colors.buttonSecondaryText : colors.buttonPrimaryText;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive || softDisabled, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'brand' && styles.brand,
        pressed && styles.pressed,
        ((disabled && !loading) || softDisabled) && styles.dimmed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: layout.controlHeight,
    borderRadius: layout.controlRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: {
    alignSelf: 'center',
    height: historyLayout.buttonHeight,
    paddingHorizontal: historyLayout.buttonPaddingHorizontal,
  },
  primary: { backgroundColor: colors.buttonPrimaryBg },
  secondary: { backgroundColor: colors.buttonSecondaryBg },
  brand: { backgroundColor: brandColors.purple },
  pressed: { opacity: 0.75 },
  dimmed: { opacity: 0.4 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: fontSizes.button, fontWeight: '600' },
});

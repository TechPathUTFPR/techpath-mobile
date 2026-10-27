import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { brandColors } from '../theme/screens';
import { colors, fontSizes, layout } from '../theme/tokens';

type Props = {
  label: string;
  onPress: () => void;
  /** primary = preto | secondary = cinza-claro (Google) | brand = roxo (Landing/Como Funciona) */
  variant?: 'primary' | 'secondary' | 'brand';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
};

export function Button({ label, onPress, variant = 'primary', loading = false, disabled = false, icon }: Props) {
  const inactive = disabled || loading;
  const textColor = variant === 'secondary' ? colors.buttonSecondaryText : colors.buttonPrimaryText;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'brand' && styles.brand,
        (pressed || (disabled && !loading)) && styles.dimmed,
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
  primary: { backgroundColor: colors.buttonPrimaryBg },
  secondary: { backgroundColor: colors.buttonSecondaryBg },
  brand: { backgroundColor: brandColors.purple },
  dimmed: { opacity: 0.75 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: fontSizes.button, fontWeight: '600' },
});

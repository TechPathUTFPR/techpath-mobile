import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/tokens';
import { profileLayout } from '../theme/screens';

/** Cartão branco com borda fina cinza-claro (itens do Meu Perfil). */
export function MenuCard({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: profileLayout.cardHeight,
    borderRadius: profileLayout.cardRadius,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.background,
    paddingHorizontal: profileLayout.cardPaddingHorizontal,
    justifyContent: 'center',
  },
  pressed: { backgroundColor: '#F7F7F7' },
  label: {
    fontSize: profileLayout.cardFontSize,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});

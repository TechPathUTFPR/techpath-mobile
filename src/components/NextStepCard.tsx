import { Pressable, StyleSheet, Text, View } from 'react-native';
import { brandColors, trailLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';
import { ChevronRightIcon } from './icons';

/** Cartão lilás da próxima etapa: número, nome, descrição e seta (acessível ao toque). */
export function NextStepCard({
  step,
  onPress,
}: {
  step: { id: string; order: number; name: string; description?: string };
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Etapa ${step.order}: ${step.name}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.order}>{step.order}.</Text>
      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={1}>
          {step.name}
        </Text>
        {step.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {step.description}
          </Text>
        ) : null}
      </View>
      <ChevronRightIcon size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: L.cardHeight,
    borderRadius: L.cardRadius,
    backgroundColor: brandColors.lilac,
    paddingHorizontal: L.cardPadding,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pressed: { opacity: 0.8 },
  order: { width: 21, fontSize: L.nameFont, lineHeight: 18, fontWeight: '600', color: colors.textPrimary },
  texts: { flex: 1, paddingRight: 8 },
  name: { fontSize: L.nameFont, lineHeight: 18, fontWeight: '600', color: colors.textPrimary },
  description: { marginTop: 8, fontSize: L.descriptionFont, lineHeight: 14, color: colors.textPrimary },
});

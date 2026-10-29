import { StyleSheet, Text, View } from 'react-native';
import { assessmentLayout } from '../theme/screens';
import { brandColors } from '../theme/screens';
import { colors } from '../theme/tokens';

/** Etiqueta lilás "Etapa X de N". */
export function StepBadge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    height: assessmentLayout.tagHeight,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: brandColors.lilac,
  },
  text: { fontSize: 13, color: colors.textPrimary },
});

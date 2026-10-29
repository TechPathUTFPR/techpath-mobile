import { StyleSheet, Text, View } from 'react-native';
import { assessmentColors, assessmentLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';

/** Etiqueta da categoria da pergunta (ex.: "Interesses"). */
export function CategoryTag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    height: L.tagHeight,
    paddingHorizontal: L.tagPaddingHorizontal,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: assessmentColors.tagBorder,
    backgroundColor: colors.background,
  },
  text: { fontSize: L.tagFont, color: assessmentColors.tagText },
});

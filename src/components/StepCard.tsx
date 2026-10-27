import { StyleSheet, Text, View } from 'react-native';
import { howItWorksLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';

/** Seção "Como Funciona": título em preto acima de um cartão branco com o texto. */
export function StepCard({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.card}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: L.sectionGap },
  label: {
    marginBottom: L.labelGap,
    paddingLeft: L.labelPaddingLeft,
    fontSize: L.labelFontSize,
    lineHeight: L.labelLineHeight,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  card: {
    minHeight: L.cardMinHeight,
    marginHorizontal: L.cardMarginHorizontal,
    paddingHorizontal: L.cardPaddingHorizontal,
    paddingVertical: L.cardPaddingVertical,
    borderRadius: L.cardRadius,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  text: {
    fontSize: L.cardFontSize,
    lineHeight: L.cardLineHeight,
    color: colors.textPrimary,
  },
});

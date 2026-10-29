import { StyleSheet, Text, View } from 'react-native';
import { buildResultNotices } from '../features/assessment/notices';
import { AssessmentResult } from '../features/assessment/types';
import { colors } from '../theme/tokens';

/** Avisos do perfil (híbrido, em descoberta, respostas uniformes). Não renderiza nada se não houver. */
export function ResultNotices({ result }: { result: AssessmentResult | null }) {
  const notices = buildResultNotices(result);
  if (notices.length === 0) return null;
  return (
    <View style={styles.wrap}>
      {notices.map((text) => (
        <Text key={text} style={styles.text} accessibilityRole="alert">
          {text}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textStrong,
    backgroundColor: '#F6F0FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

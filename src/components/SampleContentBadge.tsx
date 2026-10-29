import { StyleSheet, Text } from 'react-native';
import { TRAILS_ARE_SAMPLE } from '../data/trails';
import { assessmentColors } from '../theme/screens';

/** Aviso exibido enquanto o catálogo de trilhas for de EXEMPLO (src/data/trails.ts). */
export function SampleContentBadge() {
  if (!TRAILS_ARE_SAMPLE) return null;
  return (
    <Text style={styles.text} accessibilityRole="alert">
      CONTEÚDO DE EXEMPLO — as trilhas oficiais ainda não foram cadastradas
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: assessmentColors.simulatedBadge,
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
});

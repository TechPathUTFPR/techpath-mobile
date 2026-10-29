import { StyleSheet, Text } from 'react-native';
import { assessmentColors } from '../theme/screens';

/** Aviso exibido sempre que há DADOS SIMULADOS na tela. */
export function SimulatedBadge() {
  return (
    <Text style={styles.text} accessibilityRole="alert">
      DADOS SIMULADOS — exemplo para teste, não é um resultado real
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

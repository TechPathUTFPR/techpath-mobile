import { StyleSheet, Text, View } from 'react-native';
import { formatPercent } from '../features/assessment/logic';
import { detailsLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';
import { ProgressBar } from './ProgressBar';

/** Linha de "Outras áreas": nome, porcentagem e barra proporcional. */
export function AffinityRow({ name, percent }: { name: string; percent: number }) {
  return (
    <View>
      <View style={styles.top}>
        <Text style={styles.text} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.text}>{formatPercent(percent)}</Text>
      </View>
      <View style={{ marginTop: L.rowBarGap }}>
        <ProgressBar percent={percent} height={L.rowBarHeight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  text: { fontSize: L.rowFont, lineHeight: L.rowLine, color: colors.textPrimary },
});

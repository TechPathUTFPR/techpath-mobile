import { StyleSheet, View } from 'react-native';
import { assessmentColors } from '../theme/screens';

/** Barra horizontal: preenchimento roxo + restante cinza. `percent` é limitado a 0–100. */
export function ProgressBar({ percent, height = 6 }: { percent: number; height?: number }) {
  const p = Number.isFinite(percent) ? Math.min(Math.max(percent, 0), 100) : 0;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(p) }}
      style={[styles.track, { height, borderRadius: height / 2 }]}
    >
      <View style={[styles.fill, { width: `${p}%`, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: assessmentColors.progressTrack, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: assessmentColors.progressFill },
});

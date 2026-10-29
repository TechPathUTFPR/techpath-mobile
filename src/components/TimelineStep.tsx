import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StepView } from '../features/trail/trailModel';
import { brandColors, overviewLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';
import { CheckIcon, ChevronRightIcon } from './icons';

const STATE_LABEL = { completed: 'Concluída', current: 'Etapa atual', future: 'Etapa futura' } as const;

/**
 * Uma linha da linha do tempo: indicador circular à esquerda (concluída = roxo com check,
 * atual = roxo cheio, futura = cinza), linha vertical ligando à próxima etapa e cartão com
 * número, título, descrição e seta. Todas as etapas são abertas livremente (sem bloqueio).
 */
export function TimelineStep({ item, isLast, onPress }: { item: StepView; isLast: boolean; onPress: () => void }) {
  const done = item.state === 'completed';
  const active = item.state !== 'future';
  const lineWidth = done ? L.lineActive : L.lineIdle;
  const centerY = L.stepMinHeight / 2;

  return (
    <View style={styles.row}>
      <View style={styles.column}>
        {!isLast ? (
          <View
            style={[
              styles.line,
              {
                width: lineWidth,
                left: L.circleLeft + L.circle / 2 - lineWidth / 2,
                top: centerY + L.circle / 2,
                bottom: -(L.stepGap + centerY - L.circle / 2),
                backgroundColor: done ? brandColors.purple : L.idleColor,
              },
            ]}
          />
        ) : null}
        <View
          style={[
            styles.circle,
            { marginTop: centerY - L.circle / 2, backgroundColor: active ? brandColors.purple : L.idleColor },
          ]}
        >
          {done ? <CheckIcon size={14} /> : null}
        </View>
      </View>

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Etapa ${item.order}: ${item.step.title}. ${STATE_LABEL[item.state]}`}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <Text style={styles.order}>{item.order}.</Text>
        <View style={styles.texts}>
          <Text style={styles.name} numberOfLines={2}>
            {item.step.title}
          </Text>
          {item.step.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {item.step.description}
            </Text>
          ) : null}
        </View>
        <View style={styles.chevron}>
          <ChevronRightIcon size={20} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: L.stepGap },
  column: { width: L.columnWidth },
  line: { position: 'absolute' },
  circle: {
    marginLeft: L.circleLeft,
    width: L.circle,
    height: L.circle,
    borderRadius: L.circle / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    minHeight: L.stepMinHeight,
    borderRadius: L.stepRadius,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.background,
    paddingHorizontal: L.stepPaddingHorizontal,
    paddingTop: L.stepPaddingTop,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pressed: { backgroundColor: '#F7F7F7' },
  order: { width: L.orderWidth, fontSize: L.nameFont, lineHeight: L.nameLine, fontWeight: '600', color: colors.textPrimary },
  texts: { flex: 1, paddingRight: 28 },
  name: { fontSize: L.nameFont, lineHeight: L.nameLine, fontWeight: '600', color: colors.textPrimary },
  description: { marginTop: L.descTop, fontSize: L.descFont, lineHeight: L.descLine, color: colors.textPrimary },
  chevron: { position: 'absolute', right: L.chevronRight, top: L.chevronTop },
});

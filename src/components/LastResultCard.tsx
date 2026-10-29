import { StyleSheet, Text, View } from 'react-native';
import { formatPercent } from '../features/assessment/logic';
import { brandColors, homeLayout as L, resultLayout } from '../theme/screens';
import { colors } from '../theme/tokens';
import { formatDateLong } from '../utils/format';
import { AreaImage } from './AffinityCard';
import { Button } from './Button';

type Props =
  | { empty?: false; areaName: string; percent: number; dateIso: string; imageUri?: string | null; onPress: () => void }
  | { empty: true; onPress: () => void };

/** Cartão lilás da Home: último resultado (ou, sem avaliação, um convite para começar). */
export function LastResultCard(props: Props) {
  if (props.empty) {
    return (
      <View style={styles.card}>
        <View style={styles.inset}>
          <Text style={styles.label}>Você ainda não fez uma avaliação</Text>
          <Text style={styles.date}>Descubra seu perfil em poucos minutos.</Text>
        </View>
        <View style={{ marginTop: L.buttonTop }}>
          <Button label="Começar avaliação" onPress={props.onPress} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.card}>
      <View style={styles.inset}>
        <Text style={styles.label}>Seu último resultado!</Text>
        <Text style={styles.date}>{formatDateLong(props.dateIso)}</Text>
        <View style={styles.row}>
          <View style={styles.texts}>
            <Text style={styles.name}>{props.areaName}</Text>
            <Text style={styles.percent}>{formatPercent(props.percent)} de afinidade</Text>
          </View>
          <AreaImage uri={props.imageUri} />
        </View>
      </View>
      <View style={{ marginTop: L.buttonTop }}>
        <Button label="Ver resultado" onPress={props.onPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: L.cardRadius,
    backgroundColor: brandColors.lilac,
    padding: L.cardPadding,
    paddingTop: L.cardPaddingTop,
  },
  inset: { paddingHorizontal: L.cardTextInset },
  label: { fontSize: L.labelFont, lineHeight: L.labelLine, fontWeight: '600', color: colors.textPrimary },
  date: { fontSize: L.dateFont, lineHeight: L.dateLine, color: colors.textPrimary },
  row: { marginTop: L.rowTop, flexDirection: 'row', alignItems: 'center' },
  texts: { flex: 1, paddingRight: 8 },
  name: {
    fontSize: resultLayout.nameFont,
    lineHeight: resultLayout.nameLine,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  percent: {
    marginTop: 6, // na Home o espaço é menor que no Resultado (cartão de ~238 dp no Figma)
    fontSize: resultLayout.percentFont,
    lineHeight: resultLayout.percentLine,
    color: colors.textPrimary,
  },
});

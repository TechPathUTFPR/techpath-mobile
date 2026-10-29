import { Image, StyleSheet, Text, View } from 'react-native';
import { formatPercent } from '../features/assessment/logic';
import { assessmentColors, brandColors, resultLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';

type Props = {
  areaName: string;
  percent: number;
  /** Descrição exibida DENTRO do cartão (Resultado). Em Resultado Completo vai fora do cartão. */
  description?: string | null;
  descriptionLines?: number;
  imageUri?: string | null;
  minHeight?: number;
  paddingBottom?: number;
};

/** Quadro da área: com `imageUri` mostra a imagem; sem ela, um quadrado escuro PROVISÓRIO (como no Figma). */
export function AreaImage({ uri }: { uri?: string | null }) {
  if (uri) {
    return <Image source={{ uri }} style={styles.image} accessibilityLabel="Imagem da área" />;
  }
  return <View style={[styles.image, styles.imagePlaceholder]} accessibilityLabel="Imagem da área (provisória)" />;
}

/** Cartão lilás "Sua principal afinidade é …" (Resultado e Resultado Completo). */
export function AffinityCard({
  areaName,
  percent,
  description,
  descriptionLines,
  imageUri,
  minHeight,
  paddingBottom = L.cardPaddingBottom,
}: Props) {
  return (
    <View style={[styles.card, { minHeight, paddingBottom }]}>
      <Text style={styles.label}>Sua principal afinidade é</Text>

      <View style={styles.row}>
        <View style={styles.texts}>
          <Text style={styles.name}>{areaName}</Text>
          <Text style={styles.percent}>{formatPercent(percent)} de afinidade</Text>
        </View>
        <AreaImage uri={imageUri} />
      </View>

      {description ? (
        <Text style={styles.description} numberOfLines={descriptionLines}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: L.cardRadius,
    backgroundColor: brandColors.lilac,
    paddingHorizontal: L.cardPaddingHorizontal,
    paddingTop: L.cardPaddingTop,
  },
  label: { fontSize: L.labelFont, lineHeight: L.labelLine, color: colors.textPrimary },
  row: { marginTop: L.nameTop, flexDirection: 'row', alignItems: 'center' },
  texts: { flex: 1, paddingRight: 8 },
  name: { fontSize: L.nameFont, lineHeight: L.nameLine, fontWeight: '500', color: colors.textPrimary },
  percent: {
    marginTop: L.percentTop,
    fontSize: L.percentFont,
    lineHeight: L.percentLine,
    color: colors.textPrimary,
  },
  image: { width: L.imageSize, height: L.imageSize, marginRight: L.imageGap, borderRadius: 4 },
  imagePlaceholder: { backgroundColor: assessmentColors.imagePlaceholder },
  description: {
    marginTop: L.descriptionTop,
    fontSize: L.descriptionFont,
    lineHeight: L.descriptionLine,
    color: colors.textPrimary,
  },
});

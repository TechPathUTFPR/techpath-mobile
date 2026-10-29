import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native';
import { historyLayout, trailsLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';

/**
 * Cartão de trilha (Minhas Trilhas): capa retangular + nome. Sem capa cadastrada, mostra o
 * quadrado escuro PROVISÓRIO do Figma. Só o que o Figma prevê (sem progresso no cartão).
 */
export function TrailCard({
  name,
  coverUrl,
  width,
  onPress,
}: {
  name: string;
  coverUrl?: string;
  width: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={name}
      style={({ pressed }) => [{ width }, pressed && styles.pressed]}
    >
      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={{ width, height: width }} accessibilityLabel={`Capa de ${name}`} />
      ) : (
        <View style={[styles.cover, { width, height: width }]} />
      )}
      <Text style={styles.caption} numberOfLines={2}>
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.8 },
  cover: { backgroundColor: historyLayout.coverColor, borderRadius: 2 },
  caption: {
    marginTop: L.captionTop,
    fontSize: L.captionFont,
    lineHeight: L.captionLine,
    color: colors.textPrimary,
  },
});

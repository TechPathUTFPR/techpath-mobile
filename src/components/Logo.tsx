import { Image, StyleSheet } from 'react-native';
import { layout } from '../theme/tokens';

const ASPECT = layout.logoHeight / layout.logoWidth;

/**
 * Logo TechPath empilhada (ícone acima do nome), com fundo TRANSPARENTE.
 * ATENÇÃO: assets/images/techpath-*.png são PLACEHOLDERS extraídos do print do
 * Figma (baixa resolução). Substitua pelos originais mantendo os nomes e a
 * transparência (as telas lilás não podem ter fundo branco):
 *   techpath-logo.png (empilhada), techpath-icon.png (só ícone), techpath-wordmark.png (só nome)
 */
export function Logo({ width = layout.logoWidth }: { width?: number }) {
  return (
    <Image
      source={require('../../assets/images/techpath-logo.png')}
      style={[styles.logo, { width, height: width * ASPECT }]}
      resizeMode="contain"
      accessibilityLabel="TechPath"
    />
  );
}

const styles = StyleSheet.create({
  logo: {},
});

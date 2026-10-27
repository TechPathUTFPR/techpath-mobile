import { Image, StyleSheet, View } from 'react-native';
import { howItWorksLayout as L } from '../theme/screens';

// proporções (largura/altura) dos PNGs gerados
const ICON_ASPECT = 1.273;
const WORDMARK_ASPECT = 4.609;

/** Logo horizontal pequena (ícone + nome lado a lado), usada em "Como Funciona". */
export function LogoHorizontal() {
  return (
    <View style={styles.row} accessible accessibilityLabel="TechPath">
      <Image
        source={require('../../assets/images/techpath-icon.png')}
        style={{ height: L.logoIconHeight, width: L.logoIconHeight * ICON_ASPECT }}
        resizeMode="contain"
      />
      <Image
        source={require('../../assets/images/techpath-wordmark.png')}
        style={{ width: L.logoWordmarkWidth, height: L.logoWordmarkWidth / WORDMARK_ASPECT }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: L.logoGap },
});

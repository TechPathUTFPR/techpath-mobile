import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { Logo } from '../src/components/Logo';
import { useNavigateOnce } from '../src/hooks/useNavigateOnce';
import { brandColors, landingLayout as L } from '../src/theme/screens';
import { layout } from '../src/theme/tokens';

/** Landing Page inicial: logo + botão "Começar" → "Como Funciona". */
export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const navigateOnce = useNavigateOnce();

  // Logo posicionada na mesma proporção vertical do Figma, em qualquer tamanho de tela.
  const logoTop = Math.max(16, height * L.logoTopRatio - insets.top);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <View style={{ marginTop: logoTop, alignItems: 'center' }}>
          <Logo width={L.logoWidth} />
        </View>
      </View>
      <View style={styles.footer}>
        <Button label="Começar" variant="brand" onPress={() => navigateOnce((r) => r.push('/how-it-works'))} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: brandColors.lilac },
  body: { flex: 1 },
  footer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: L.footerPaddingBottom,
  },
});

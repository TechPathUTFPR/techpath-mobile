import { Pressable, StyleSheet, Text, View } from 'react-native';
import { profileLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';
import { ChevronLeftIcon } from './icons';

/** Cabeçalho com seta de voltar à esquerda e título centralizado (Meu Perfil, Editar Cadastro). */
export function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        style={styles.back}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
      >
        <ChevronLeftIcon size={L.backIconSize} />
      </Pressable>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: L.headerHeight },
  back: { position: 'absolute', left: L.backLeft - 3, top: 0, width: L.backIconSize, height: L.backIconSize },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: L.titleTop,
    textAlign: 'center',
    fontSize: L.titleFontSize,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

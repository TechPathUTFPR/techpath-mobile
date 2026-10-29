import { Pressable, StyleSheet, Text, View } from 'react-native';
import { brandHeaderLayout as L } from '../theme/screens';
import { colors } from '../theme/tokens';
import { Avatar } from './Avatar';
import { ChevronLeftIcon } from './icons';
import { LogoHorizontal } from './LogoHorizontal';

type Props = {
  /** Mostra a seta de voltar à esquerda. */
  onBack?: () => void;
  /** Mostra "Sair" à direita. */
  onExit?: () => void;
  /** Mostra o botão "Meu perfil" (avatar) à direita. */
  onProfile?: () => void;
};

/** Cabeçalho com a logo centralizada; seta de voltar (esq.) e/ou "Sair" (dir.). */
export function BrandHeader({ onBack, onExit, onProfile }: Props) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <ChevronLeftIcon size={30} />
        </Pressable>
      ) : null}

      <LogoHorizontal />

      {onExit ? (
        <Pressable
          onPress={onExit}
          hitSlop={12}
          style={styles.exit}
          accessibilityRole="button"
          accessibilityLabel="Sair"
        >
          <Text style={styles.exitText}>Sair</Text>
        </Pressable>
      ) : null}

      {onProfile ? (
        <Pressable
          onPress={onProfile}
          hitSlop={10}
          style={styles.profile}
          accessibilityRole="button"
          accessibilityLabel="Meu perfil"
        >
          <Avatar size={PROFILE_SIZE} />
        </Pressable>
      ) : null}
    </View>
  );
}

const PROFILE_SIZE = 32;

const styles = StyleSheet.create({
  row: {
    marginTop: L.top,
    height: L.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: { position: 'absolute', left: L.backLeft, top: -1, width: 30, height: 30 },
  exit: { position: 'absolute', right: L.exitRight, top: 0, bottom: 0, justifyContent: 'center' },
  profile: { position: 'absolute', right: L.backLeft, top: (L.height - PROFILE_SIZE) / 2, width: PROFILE_SIZE, height: PROFILE_SIZE },
  exitText: { fontSize: 14, color: colors.textPrimary },
});

import { Pressable, StyleSheet, View } from 'react-native';
import { profileLayout as L } from '../theme/screens';
import { Avatar } from './Avatar';
import { PencilIcon } from './icons';

/** Foto de perfil circular com o lápis de edição no canto superior direito (Meu Perfil e Editar Cadastro). */
export function ProfilePhoto({ uri, onEditPress }: { uri?: string | null; onEditPress: () => void }) {
  return (
    <View style={styles.wrap}>
      <Avatar size={L.avatarSize} uri={uri ?? null} />
      <Pressable
        onPress={onEditPress}
        hitSlop={12}
        style={styles.pencil}
        accessibilityRole="button"
        accessibilityLabel="Alterar foto de perfil"
      >
        <PencilIcon size={L.pencilSize} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center', width: L.avatarSize, height: L.avatarSize },
  pencil: {
    position: 'absolute',
    width: L.pencilSize,
    height: L.pencilSize,
    left: L.avatarSize / 2 + L.pencilOffsetX - L.pencilSize / 2,
    top: L.avatarSize / 2 + L.pencilOffsetY - L.pencilSize / 2,
  },
});

import { Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { screenColors } from '../theme/screens';

type Props = { uri?: string | null; size: number };

/**
 * Foto de perfil circular.
 * AVATAR PROVISÓRIO: o app e o backend ainda não têm foto de perfil, então sem
 * `uri` é exibida uma silhueta neutra — não é a foto de nenhuma pessoa.
 */
export function Avatar({ uri, size }: Props) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} accessibilityLabel="Foto de perfil" />
      ) : (
        <Svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          accessibilityLabel="Foto de perfil provisória (avatar padrão)"
        >
          <Circle cx={50} cy={38} r={18} fill={screenColors.avatarGlyph} />
          <Path d="M14 100c0-22 16-36 36-36s36 14 36 36z" fill={screenColors.avatarGlyph} />
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { overflow: 'hidden', backgroundColor: screenColors.avatarBackground },
});

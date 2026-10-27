import { ComponentPropsWithoutRef, forwardRef, useState } from 'react';
import { Pressable, TextInput } from 'react-native';
import { screenColors } from '../theme/screens';
import { EyeIcon } from './icons';
import { TextField } from './TextField';

type Props = Omit<ComponentPropsWithoutRef<typeof TextField>, 'secureTextEntry' | 'rightAccessory'> & {
  /**
   * Mostra o olho para exibir/ocultar a senha. O Figma não tem esse ícone;
   * passe `false` para voltar ao visual exato (senha sempre oculta).
   */
  showToggle?: boolean;
};

export const PasswordField = forwardRef<TextInput, Props>(function PasswordField(
  { showToggle = true, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      ref={ref}
      {...rest}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      rightAccessory={
        showToggle ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <EyeIcon off={visible} color={screenColors.passwordToggle} />
          </Pressable>
        ) : undefined
      }
    />
  );
});

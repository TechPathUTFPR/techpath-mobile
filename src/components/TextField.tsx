import { ReactNode, forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fontSizes, layout } from '../theme/tokens';

type Props = TextInputProps & {
  /** Mensagem de erro exibida abaixo do campo (estado de erro não existe no Figma). */
  error?: string | null;
  /** Elemento opcional dentro do campo, à direita (ex.: olho de mostrar senha). */
  rightAccessory?: ReactNode;
};

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { error, rightAccessory, style, ...rest },
  ref,
) {
  return (
    <View>
      <View>
        <TextInput
          ref={ref}
          placeholderTextColor={colors.placeholder}
          style={[
            styles.input,
            !!rightAccessory && styles.inputWithAccessory,
            !!error && styles.inputError,
            style,
          ]}
          {...rest}
        />
        {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
      </View>
      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    height: layout.controlHeight,
    borderRadius: layout.controlRadius,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: layout.inputPaddingHorizontal,
    paddingVertical: 0,
    fontSize: fontSizes.input,
    color: colors.textPrimary,
  },
  inputWithAccessory: {
    paddingRight: 44,
  },
  inputError: {
    borderColor: colors.error,
  },
  accessory: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 44,
    height: layout.controlHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    marginTop: 4,
    fontSize: fontSizes.error,
    color: colors.error,
  },
});

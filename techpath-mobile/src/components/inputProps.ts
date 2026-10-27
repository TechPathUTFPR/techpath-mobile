import { TextInputProps } from 'react-native';

/** Propriedades de teclado/autofill para campos de e-mail. */
export const emailInputProps: TextInputProps = {
  keyboardType: 'email-address',
  inputMode: 'email',
  autoCapitalize: 'none',
  autoCorrect: false,
  autoComplete: 'email',
  textContentType: 'emailAddress',
};

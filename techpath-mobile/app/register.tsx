import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { emailInputProps } from '../src/components/inputProps';
import { LabeledField } from '../src/components/LabeledField';
import { Logo } from '../src/components/Logo';
import { PasswordField } from '../src/components/PasswordField';
import { TextField } from '../src/components/TextField';
import { AuthError, registerWithEmail } from '../src/services/authService';
import { registerLayout, screenColors } from '../src/theme/screens';
import { colors, fontSizes, layout } from '../src/theme/tokens';
import {
  validateEmail,
  validateNewPassword,
  validatePasswordConfirmation,
} from '../src/utils/validation';

type FieldErrors = { email: string | null; password: string | null; confirm: string | null };
const NO_ERRORS: FieldErrors = { email: null, password: null, confirm: null };

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FieldErrors>(NO_ERRORS);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  // Trava síncrona contra envio duplicado (o state `loading` atualiza só no próximo render).
  const submittingRef = useRef(false);

  const handleSubmit = async () => {
    if (submittingRef.current) return;

    const next: FieldErrors = {
      email: validateEmail(email),
      password: validateNewPassword(password),
      confirm: validatePasswordConfirmation(password, confirm),
    };
    setErrors(next);
    setFormError(null);

    const firstInvalid = next.email ? emailRef : next.password ? passwordRef : next.confirm ? confirmRef : null;
    if (firstInvalid) {
      firstInvalid.current?.focus();
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    try {
      await registerWithEmail(email.trim(), password); // cadastro REAL (backend)
      router.replace('/home');
    } catch (error) {
      setFormError(
        error instanceof AuthError ? error.message : 'Não foi possível criar a conta. Tente novamente.',
      );
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const goToLogin = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrap}>
            <Logo />
          </View>

          {/* Em telas altas este espaço cresce, mantendo o formulário na parte inferior como no Figma. */}
          <View style={styles.spacer} />

          <LabeledField label="Email">
            <TextField
              ref={emailRef}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder="email@dominio.com"
              error={errors.email}
              editable={!loading}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              accessibilityLabel="E-mail"
              {...emailInputProps}
            />
          </LabeledField>

          <LabeledField label="Senha">
            <PasswordField
              ref={passwordRef}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password || errors.confirm) {
                  setErrors((prev) => ({ ...prev, password: null, confirm: null }));
                }
              }}
              placeholder="***"
              error={errors.password}
              editable={!loading}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
              accessibilityLabel="Senha"
            />
          </LabeledField>

          <LabeledField label="Confirmar Senha">
            <PasswordField
              ref={confirmRef}
              value={confirm}
              onChangeText={(text) => {
                setConfirm(text);
                if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: null }));
              }}
              onBlur={() => {
                // Feedback imediato quando as senhas já foram digitadas e são diferentes.
                if (confirm && password && confirm !== password) {
                  setErrors((prev) => ({ ...prev, confirm: 'As senhas não coincidem.' }));
                }
              }}
              placeholder="***"
              error={errors.confirm}
              editable={!loading}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              accessibilityLabel="Confirmar senha"
            />
          </LabeledField>

          {formError ? (
            <Text style={styles.formError} accessibilityRole="alert">
              {formError}
            </Text>
          ) : null}

          <View style={styles.submit}>
            <Button label="Criar Conta" onPress={handleSubmit} loading={loading} />
          </View>

          <View style={styles.switchBlock}>
            <Text style={styles.switchText}>Já possui uma conta?</Text>
            <Pressable onPress={goToLogin} hitSlop={10} disabled={loading} accessibilityRole="link">
              <Text style={styles.switchLink}>Entre aqui</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: registerLayout.contentPaddingTop,
    paddingBottom: registerLayout.contentPaddingBottom,
  },
  logoWrap: { alignItems: 'center' },
  spacer: { flex: 1, minHeight: registerLayout.spacerMinHeight },
  formError: {
    marginTop: 8,
    fontSize: fontSizes.error,
    color: colors.error,
    textAlign: 'center',
  },
  submit: { marginTop: registerLayout.submitTop },
  switchBlock: { marginTop: registerLayout.switchTop, alignItems: 'center' },
  switchText: {
    fontSize: registerLayout.switchFontSize,
    lineHeight: registerLayout.switchLineHeight,
    color: screenColors.switchText,
  },
  switchLink: {
    fontSize: registerLayout.switchLinkFontSize,
    lineHeight: registerLayout.switchLineHeight,
    fontWeight: '700',
    color: screenColors.switchLink,
  },
});

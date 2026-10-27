import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { emailInputProps } from '../src/components/inputProps';
import { LabeledField } from '../src/components/LabeledField';
import { Logo } from '../src/components/Logo';
import { PasswordField } from '../src/components/PasswordField';
import { TextField } from '../src/components/TextField';
import { FeatureUnavailableError } from '../src/services/errors';
import { requestPasswordReset } from '../src/services/passwordResetService';
import { resetLayout as L } from '../src/theme/screens';
import { colors, fontSizes, layout } from '../src/theme/tokens';
import { validateEmail, validateNewPassword, validatePasswordConfirmation } from '../src/utils/validation';

type FieldErrors = { email: string | null; password: string | null; confirm: string | null };

/**
 * Redefinir Senha. O formulário valida tudo, mas a redefinição REAL depende de um
 * fluxo seguro do backend (código/token por e-mail) que ainda não existe — ver
 * src/services/passwordResetService.ts. Nenhuma senha é alterada.
 */
export default function ResetPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ email: null, password: null, confirm: null });
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const submittingRef = useRef(false);

  const goToLogin = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/login');
  };

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
      await requestPasswordReset({ email: email.trim(), newPassword: password });
      // Só chega aqui quando o backend passar a suportar a redefinição.
      Alert.alert('Senha redefinida', 'Sua senha foi alterada. Faça login com a nova senha.', [
        { text: 'Ir para o Login', onPress: goToLogin },
      ]);
    } catch (error) {
      if (error instanceof FeatureUnavailableError) {
        Alert.alert('Redefinição de senha indisponível', error.message, [
          { text: 'Ficar aqui', style: 'cancel' },
          { text: 'Ir para o Login', onPress: goToLogin },
        ]);
      } else {
        setFormError('Não foi possível redefinir a senha. Tente novamente.');
      }
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
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

          <View style={styles.form}>
            <LabeledField label="Email" gap={L.emailGap}>
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

            <LabeledField label="Nova Senha" gap={L.fieldGap}>
              <PasswordField
                ref={passwordRef}
                showToggle={false}
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
                accessibilityLabel="Nova senha"
              />
            </LabeledField>

            <LabeledField label="Confirmar Senha" gap={L.fieldGap}>
              <PasswordField
                ref={confirmRef}
                showToggle={false}
                value={confirm}
                onChangeText={(text) => {
                  setConfirm(text);
                  if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: null }));
                }}
                onBlur={() => {
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
              <Button label="Retornar ao Login" onPress={handleSubmit} loading={loading} />
            </View>
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
    paddingTop: L.contentPaddingTop,
    paddingBottom: L.contentPaddingBottom,
  },
  logoWrap: { alignItems: 'center' },
  form: { marginTop: L.formTop },
  formError: { marginTop: 8, fontSize: fontSizes.error, color: colors.error, textAlign: 'center' },
  submit: { marginTop: L.submitTop },
});

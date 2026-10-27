import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
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
import { GoogleIcon } from '../src/components/GoogleIcon';
import { Logo } from '../src/components/Logo';
import { TextField } from '../src/components/TextField';
import { env } from '../src/config/env';
import { AuthError, loginWithEmail } from '../src/services/authService';
import { colors, fontSizes, layout } from '../src/theme/tokens';
import { validateLoginEmail, validateLoginPassword } from '../src/utils/validation';

type FieldErrors = { email: string | null; password: string | null };

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ email: null, password: null });
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  // Trava síncrona: impede envio duplicado mesmo com toques rápidos
  // (o state `loading` só atualiza no próximo render).
  const submittingRef = useRef(false);

  const handleSubmit = async () => {
    if (submittingRef.current) return;

    const nextErrors: FieldErrors = {
      email: validateLoginEmail(email),
      password: validateLoginPassword(password, env.authMode === 'simulated'),
    };
    setErrors(nextErrors);
    setFormError(null);

    if (nextErrors.email || nextErrors.password) {
      (nextErrors.email ? emailRef : passwordRef).current?.focus();
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    try {
      // Modo simulado (padrão): sem servidor. Modo real: POST /users/login. Ver authService.ts.
      await loginWithEmail(email.trim(), password);
      router.replace('/home');
    } catch (error) {
      setFormError(
        error instanceof AuthError ? error.message : 'Não foi possível entrar. Tente novamente.',
      );
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  // A tela existe, mas a redefinição real depende do backend (ver reset-password.tsx).
  const handleForgotPassword = () => router.push('/reset-password');

  const handleGoogle = () => {
    Alert.alert(
      'Login com Google indisponível',
      'O backend do TechPath ainda não possui autenticação com Google, então não é possível entrar por aqui. Use seu e-mail e senha.',
    );
  };

  const openLegal = (url: string, title: string) => {
    if (!url) {
      Alert.alert(title, 'Esta página ainda não está disponível.');
      return;
    }
    Linking.openURL(url).catch(() => Alert.alert(title, 'Não foi possível abrir a página.'));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrap}>
            <Logo />
          </View>

          <Text style={styles.title} accessibilityRole="header">
            Seja bem vindo(a)!
          </Text>

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
            keyboardType="email-address"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            accessibilityLabel="E-mail"
          />

          <View style={styles.passwordField}>
            <TextField
              ref={passwordRef}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              placeholder="***"
              error={errors.password}
              editable={!loading}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              accessibilityLabel="Senha"
            />
          </View>

          {formError ? (
            <Text style={styles.formError} accessibilityRole="alert">
              {formError}
            </Text>
          ) : null}

          <View style={styles.submit}>
            <Button label="Continuar" onPress={handleSubmit} loading={loading} />
          </View>

          <View style={styles.linksRow}>
            <Pressable onPress={handleForgotPassword} hitSlop={8} disabled={loading} accessibilityRole="link">
              <Text style={styles.forgot}>Esqueceu a senha?</Text>
            </Pressable>
            <View style={styles.signupGroup}>
              <Text style={styles.noAccount}>Ainda não possui cadastro? </Text>
              <Pressable onPress={() => router.push('/register')} hitSlop={8} disabled={loading} accessibilityRole="link">
                <Text style={styles.signup}>Criar conta</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            label="Continuar com o Google"
            variant="secondary"
            icon={<GoogleIcon />}
            onPress={handleGoogle}
            disabled={loading}
          />

          <Text style={styles.footer}>
            Ao clicar em continuar, você concorda com os nossos{'\n'}
            <Text
              style={styles.footerLink}
              accessibilityRole="link"
              onPress={() => openLegal(env.termsUrl, 'Termos de Serviço')}
            >
              Termos de Serviço
            </Text>
            {' e com a '}
            <Text
              style={styles.footerLink}
              accessibilityRole="link"
              onPress={() => openLegal(env.privacyUrl, 'Política de Privacidade')}
            >
              Política de Privacidade
            </Text>
          </Text>
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
    paddingTop: 60,
    paddingBottom: 24,
  },
  logoWrap: { alignItems: 'center' },
  title: {
    marginTop: 82,
    marginBottom: 24,
    textAlign: 'center',
    fontSize: fontSizes.title,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  passwordField: { marginTop: 16 },
  formError: {
    marginTop: 12,
    fontSize: fontSizes.error,
    color: colors.error,
    textAlign: 'center',
  },
  submit: { marginTop: 16 },
  linksRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgot: { fontSize: fontSizes.link, fontWeight: '600', color: colors.textStrong },
  signupGroup: { flexDirection: 'row', alignItems: 'center' },
  noAccount: { fontSize: fontSizes.link, color: colors.textMuted },
  signup: { fontSize: fontSizes.link, fontWeight: '600', color: colors.textLink },
  dividerRow: {
    marginTop: 34,
    marginBottom: 24,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerLabel: { fontSize: fontSizes.link, color: colors.dividerLabel },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: fontSizes.footer,
    lineHeight: 18,
    color: colors.textFooter,
  },
  footerLink: { color: colors.textFooterLink, fontWeight: '500' },
});

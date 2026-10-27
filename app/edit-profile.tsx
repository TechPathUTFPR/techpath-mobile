import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { emailInputProps } from '../src/components/inputProps';
import { LabeledField } from '../src/components/LabeledField';
import { PasswordField } from '../src/components/PasswordField';
import { ProfilePhoto } from '../src/components/ProfilePhoto';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { TextField } from '../src/components/TextField';
import { FeatureUnavailableError } from '../src/services/errors';
import { getSession } from '../src/services/session';
import { updateProfile } from '../src/services/userService';
import { editLayout as L, profileLayout } from '../src/theme/screens';
import { colors, fontSizes, layout } from '../src/theme/tokens';
import {
  validateEmail,
  validateName,
  validateNewPassword,
  validatePasswordConfirmation,
} from '../src/utils/validation';

type FieldErrors = { name: string | null; email: string | null; password: string | null; confirm: string | null };
const NO_ERRORS: FieldErrors = { name: null, email: null, password: null, confirm: null };

export default function EditProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const [loaded, setLoaded] = useState(false);
  const [initial, setInitial] = useState({ name: '', email: '' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FieldErrors>(NO_ERRORS);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const submittingRef = useRef(false);
  const allowLeaveRef = useRef(false);

  // Carrega os dados atuais do usuário autenticado.
  useEffect(() => {
    let active = true;
    (async () => {
      const session = await getSession();
      if (!session) {
        allowLeaveRef.current = true;
        router.replace('/login');
        return;
      }
      if (!active) return;
      const values = { name: session.user?.name ?? '', email: session.user?.email ?? '' };
      setInitial(values);
      setName(values.name);
      setEmail(values.email);
      setLoaded(true);
    })().catch(() => setLoaded(true));
    return () => {
      active = false;
    };
  }, [router]);

  const dirty = loaded && (name !== initial.name || email !== initial.email || password !== '' || confirm !== '');

  // Avisa antes de sair com alterações não salvas (seta, gesto de voltar ou botão do Android).
  useEffect(() => {
    return navigation.addListener('beforeRemove', (event) => {
      if (allowLeaveRef.current || !dirty) return;
      event.preventDefault();
      Alert.alert('Descartar alterações?', 'Você tem alterações não salvas. Se sair agora, elas serão perdidas.', [
        { text: 'Continuar editando', style: 'cancel' },
        { text: 'Descartar', style: 'destructive', onPress: () => navigation.dispatch(event.data.action) },
      ]);
    });
  }, [navigation, dirty]);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  };

  const handleEditPhoto = () => {
    Alert.alert(
      'Alterar foto indisponível',
      'O app e o backend ainda não têm suporte a foto de perfil (seleção e envio de imagem), então nada foi alterado ou salvo.',
    );
  };

  const handleSave = async () => {
    if (submittingRef.current) return;

    // Senha é opcional: só é validada se o usuário preencheu algum dos dois campos.
    const changingPassword = password !== '' || confirm !== '';
    const next: FieldErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: changingPassword ? validateNewPassword(password) : null,
      confirm: changingPassword ? validatePasswordConfirmation(password, confirm) : null,
    };
    setErrors(next);
    setFormError(null);

    const firstInvalid = next.name
      ? nameRef
      : next.email
        ? emailRef
        : next.password
          ? passwordRef
          : next.confirm
            ? confirmRef
            : null;
    if (firstInvalid) {
      firstInvalid.current?.focus();
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    try {
      const result = await updateProfile({ name, email, password: changingPassword ? password : undefined });
      // Só chegamos aqui se algo foi realmente salvo (neste aparelho, no modo simulado).
      const saved = { name: name.trim(), email: email.trim() };
      setInitial(saved);
      setName(saved.name);
      setEmail(saved.email);
      setPassword('');
      setConfirm('');
      Alert.alert(
        'Alterações salvas neste aparelho',
        'Modo simulado: nome e e-mail foram atualizados apenas neste aparelho; o servidor não foi alterado.' +
          (result.passwordIgnored ? ' A senha não foi armazenada (nenhuma senha é guardada no modo simulado).' : ''),
        [{ text: 'OK', onPress: goBack }],
        { cancelable: false },
      );
    } catch (error) {
      // Mantém tudo preenchido e explica o que aconteceu.
      setFormError(
        error instanceof FeatureUnavailableError || error instanceof Error
          ? error.message
          : 'Não foi possível salvar. Tente novamente.',
      );
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScreenHeader title="Editar Cadastro" onBack={goBack} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ProfilePhoto uri={null} onEditPress={handleEditPhoto} />

          <View style={styles.form}>
            <LabeledField label="Nome Usuário" gap={L.fieldGap}>
              <TextField
                ref={nameRef}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                placeholder="Nome do Usuário"
                error={errors.name}
                editable={loaded && !loading}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                accessibilityLabel="Nome do usuário"
              />
            </LabeledField>

            <LabeledField label="Email" gap={L.fieldGap}>
              <TextField
                ref={emailRef}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                placeholder="email@dominio.com"
                error={errors.email}
                editable={loaded && !loading}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                accessibilityLabel="E-mail"
                {...emailInputProps}
              />
            </LabeledField>

            <LabeledField label="Senha" gap={L.fieldGap}>
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
                editable={loaded && !loading}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                accessibilityLabel="Nova senha (opcional)"
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
                editable={loaded && !loading}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleSave}
                accessibilityLabel="Confirmar senha"
              />
            </LabeledField>

            {formError ? (
              <Text style={styles.formError} accessibilityRole="alert">
                {formError}
              </Text>
            ) : null}

            <View style={styles.submit}>
              <Button label="Salvar" onPress={handleSave} loading={loading} disabled={!loaded} />
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
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: profileLayout.avatarTop,
    paddingBottom: L.contentPaddingBottom,
  },
  form: { marginTop: L.formTop },
  formError: { marginTop: 8, fontSize: fontSizes.error, color: colors.error, textAlign: 'center' },
  submit: { marginTop: L.submitTop },
});

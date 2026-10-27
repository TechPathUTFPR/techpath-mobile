import { Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { MenuCard } from '../src/components/MenuCard';
import { ProfilePhoto } from '../src/components/ProfilePhoto';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { useNavigateOnce } from '../src/hooks/useNavigateOnce';
import { SessionUser, getSession } from '../src/services/session';
import { profileLayout as L } from '../src/theme/screens';
import { colors, layout } from '../src/theme/tokens';
import { confirmSignOut } from '../src/utils/confirmSignOut';

/**
 * Itens do menu. `route` é o destino quando a tela existir; enquanto for null,
 * o toque exibe um aviso claro com a dependência (não há rota "de mentira").
 */
const MENU: { label: string; route: Href | null; missing: string }[] = [
  {
    label: 'Minhas Trilhas',
    route: null,
    missing:
      'A tela "Minhas Trilhas" ainda não foi implementada. Depende do layout no Figma e de um endpoint de trilhas no backend.',
  },
  {
    label: 'Histórico de Resultados',
    route: null,
    missing:
      'A tela "Histórico de Resultados" ainda não foi implementada. Depende do layout no Figma e de um endpoint de resultados no backend.',
  },
  { label: 'Editar Cadastro', route: '/edit-profile', missing: '' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const [user, setUser] = useState<SessionUser | null>(null);

  // Recarrega ao voltar do Editar Cadastro, para mostrar os dados atualizados.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const session = await getSession();
        if (!session) {
          router.replace('/login'); // sem sessão não há perfil
          return;
        }
        if (active) setUser(session.user);
      })().catch(() => {});
      return () => {
        active = false;
      };
    }, [router]),
  );

  // Sem nome usa o e-mail; sem nenhum dos dois, "Usuário".
  const displayName = user?.name?.trim() || user?.email?.trim() || 'Usuário';

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  };

  const handleEditPhoto = () => {
    Alert.alert(
      'Alterar foto indisponível',
      'O app e o backend ainda não têm suporte a foto de perfil, então nada foi alterado ou salvo.',
    );
  };

  const handleSignOut = () => confirmSignOut(() => router.replace('/login'));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScreenHeader title="Meu Perfil" onBack={goBack} />

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <ProfilePhoto uri={null} onEditPress={handleEditPhoto} />

        <Text style={styles.name} numberOfLines={1}>
          {displayName}
        </Text>

        <View style={styles.cards}>
          {MENU.map((item) => (
            <MenuCard
              key={item.label}
              label={item.label}
              onPress={() => {
                const route = item.route;
                if (route) navigateOnce((r) => r.push(route));
                else Alert.alert(item.label, item.missing);
              }}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Sair" onPress={handleSignOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  body: { paddingTop: L.avatarTop, paddingBottom: 16 },
  name: {
    marginTop: L.nameTop,
    paddingHorizontal: layout.screenPaddingHorizontal,
    textAlign: 'center',
    fontSize: L.nameFontSize,
    lineHeight: 20,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  cards: { marginTop: L.cardsTop, marginHorizontal: L.cardMarginHorizontal, gap: L.cardGap },
  footer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 8,
    paddingBottom: L.footerPaddingBottom,
  },
});

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'techpath.accessToken';
const USER_KEY = 'techpath.sessionUser';

/** Dados do usuário autenticado exibidos no app. A SENHA nunca é guardada. */
export type SessionUser = {
  name: string | null;
  email: string | null;
  /** true = sessão do modo SIMULADO (sem servidor, sem token). */
  simulated: boolean;
};

// SecureStore não existe na web; lá usamos apenas memória (some ao recarregar).
const memory: Record<string, string | undefined> = {};

async function setItem(key: string, value: string): Promise<void> {
  memory[key] = value;
  if (Platform.OS === 'web') return;
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') return memory[key] ?? null;
  return SecureStore.getItemAsync(key);
}

async function removeItem(key: string): Promise<void> {
  delete memory[key];
  if (Platform.OS === 'web') return;
  await SecureStore.deleteItemAsync(key);
}

export const saveToken = (token: string) => setItem(TOKEN_KEY, token);
export const getToken = () => getItem(TOKEN_KEY);
export const clearToken = () => removeItem(TOKEN_KEY);

export const saveUser = (user: SessionUser) => setItem(USER_KEY, JSON.stringify(user));
export const clearUser = () => removeItem(USER_KEY);

export async function getUser(): Promise<SessionUser | null> {
  const raw = await getItem(USER_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<SessionUser>;
    return {
      name: typeof data.name === 'string' ? data.name : null,
      email: typeof data.email === 'string' ? data.email : null,
      simulated: data.simulated === true,
    };
  } catch {
    return null;
  }
}

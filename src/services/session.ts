import { decodeJwtPayload } from '../utils/jwt';
import { deriveNameFromEmail } from '../utils/userName';
import {
  SessionUser,
  clearToken,
  clearUser,
  getToken,
  getUser,
  saveToken,
  saveUser,
} from './tokenStorage';

export type { SessionUser };

const pickString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

/**
 * Inicia a sessão após login/cadastro bem-sucedido.
 * Nome e e-mail vêm das claims do token, se existirem; senão, do que o app
 * já sabe (e-mail digitado; nome enviado no cadastro).
 */
export async function startSession(token: string, hint: Partial<SessionUser> = {}): Promise<void> {
  const claims = decodeJwtPayload(token);
  const user: SessionUser = {
    name: pickString(claims?.name) ?? hint.name ?? null,
    email: pickString(claims?.email) ?? hint.email ?? null,
    simulated: false,
  };
  await saveToken(token);
  await saveUser(user);
}

/**
 * Sessão do modo SIMULADO: não há servidor nem token. Guarda só nome/e-mail no
 * aparelho (a senha é descartada) e marca `simulated: true` para que o app nunca
 * trate isso como autenticação real.
 */
export async function startSimulatedSession(email: string): Promise<void> {
  await clearToken(); // garante que não sobra token real de uma sessão anterior
  await saveUser({ name: deriveNameFromEmail(email), email: email.trim(), simulated: true });
}

export type Session = { token: string | null; user: SessionUser | null; simulated: boolean };

/** Sessão atual (real ou simulada) ou null se não houver. */
export async function getSession(): Promise<Session | null> {
  const [token, user] = await Promise.all([getToken(), getUser()]);
  if (!token && !user?.simulated) return null;
  return { token, user, simulated: !token && !!user?.simulated };
}

export const getSessionUser = getUser;

/** Atualiza nome/e-mail da sessão salva NESTE aparelho (não altera nenhum servidor). */
export async function updateSessionUser(patch: { name: string; email: string }): Promise<SessionUser> {
  const current = await getUser();
  const next: SessionUser = {
    name: patch.name,
    email: patch.email,
    simulated: current?.simulated ?? false,
  };
  await saveUser(next);
  return next;
}

/**
 * Encerra a sessão NESTE aparelho: apaga o token e os dados de sessão.
 * Não apaga a conta. O backend não tem endpoint de logout (JWT sem estado),
 * então o token não é revogado no servidor — ele só deixa de existir no app.
 */
export async function signOut(): Promise<void> {
  await Promise.all([clearToken(), clearUser()]);
}

/** Chave que identifica o dono dos dados guardados no aparelho (avaliações/histórico): o e-mail. */
export function getUserKey(session: Session): string {
  return session.user?.email?.trim().toLowerCase() || 'sem-email';
}

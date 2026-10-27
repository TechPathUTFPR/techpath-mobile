import { env } from '../config/env';
import { deriveNameFromEmail } from '../utils/userName';
import { startSession, startSimulatedSession } from './session';

export type AuthErrorKind =
  | 'config'
  | 'network'
  | 'invalid_credentials'
  | 'invalid_request'
  | 'email_in_use'
  | 'server';

export class AuthError extends Error {
  kind: AuthErrorKind;

  constructor(kind: AuthErrorKind, message: string) {
    super(message);
    this.name = 'AuthError';
    this.kind = kind;
  }
}

const TIMEOUT_MS = 15000;

/** POST JSON no backend, com timeout e tratamento de falha de rede/configuração. */
async function postJson(path: string, body: Record<string, unknown>): Promise<Response> {
  if (!env.apiUrl) {
    throw new AuthError(
      'config',
      'O endereço da API não está configurado. Defina EXPO_PUBLIC_API_URL no arquivo .env.local.',
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${env.apiUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new AuthError(
      'network',
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
    );
  } finally {
    clearTimeout(timer);
  }
}

async function readAccessToken(response: Response): Promise<string> {
  const data: unknown = await response.json().catch(() => null);
  const token =
    typeof data === 'object' && data !== null && 'accessToken' in data
      ? (data as { accessToken: unknown }).accessToken
      : null;

  if (typeof token !== 'string' || token.length === 0) {
    throw new AuthError('server', 'Resposta inesperada do servidor. Tente novamente.');
  }
  return token;
}

/** Extrai a(s) mensagem(ns) de validação que o backend (NestJS) devolve em erros 400. */
async function readServerMessage(response: Response): Promise<string | null> {
  const data: unknown = await response.json().catch(() => null);
  if (typeof data !== 'object' || data === null || !('message' in data)) return null;
  const message = (data as { message: unknown }).message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) return message.filter((m) => typeof m === 'string').join('; ') || null;
  return null;
}

/**
 * Login com e-mail e senha.
 *
 * MODO SIMULADO (padrão, EXPO_PUBLIC_AUTH_MODE=simulated): NÃO há autenticação.
 * O app só confere o formato na tela (e-mail com "@" e senha de 8+ caracteres) e
 * abre uma sessão local marcada como simulada. Nenhuma conta é verificada e a
 * senha não é enviada nem guardada.
 *
 * MODO REAL (EXPO_PUBLIC_AUTH_MODE=real):
 *   POST {API_URL}/users/login  { email, password }  ->  { accessToken }
 */
export async function loginWithEmail(email: string, password: string): Promise<string | null> {
  if (env.authMode === 'simulated') {
    console.warn('[TechPath] Login SIMULADO: nenhuma autenticação foi feita em servidor algum.');
    await startSimulatedSession(email);
    return null; // não existe token real
  }

  const response = await postJson('/users/login', { email, password });

  if (response.status === 401 || response.status === 404) {
    throw new AuthError('invalid_credentials', 'E-mail ou senha incorretos.');
  }
  if (response.status === 400) {
    throw new AuthError('invalid_request', 'Dados inválidos. Verifique seu e-mail e senha.');
  }
  if (!response.ok) {
    throw new AuthError('server', 'O servidor está indisponível no momento. Tente novamente mais tarde.');
  }

  const token = await readAccessToken(response);
  await startSession(token, { email });
  return token;
}

/**
 * Cadastro REAL no backend TechPath:
 *   POST {API_URL}/users/register  { name, email, password }  ->  { accessToken }
 *
 * O backend exige `name`, mas o Figma não tem esse campo. Enviamos um nome
 * PROVISÓRIO derivado do e-mail (ver src/utils/userName.ts). Em caso de sucesso
 * a sessão já é iniciada, pois o backend devolve o accessToken.
 */
export async function registerWithEmail(email: string, password: string): Promise<string> {
  const name = deriveNameFromEmail(email);
  const response = await postJson('/users/register', { name, email, password });

  if (response.status === 409) {
    throw new AuthError('email_in_use', 'Este e-mail já está cadastrado. Toque em "Entre aqui" para fazer login.');
  }
  if (response.status === 400 || response.status === 422) {
    const detail = await readServerMessage(response);
    throw new AuthError(
      'invalid_request',
      detail ? `O servidor recusou os dados: ${detail}` : 'Dados inválidos. Verifique e-mail e senha.',
    );
  }
  if (!response.ok) {
    throw new AuthError('server', 'O servidor está indisponível no momento. Tente novamente mais tarde.');
  }

  const token = await readAccessToken(response);
  await startSession(token, { email, name });
  return token;
}

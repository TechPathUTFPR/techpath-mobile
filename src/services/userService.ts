import { FeatureUnavailableError } from './errors';
import { getSession, updateSessionUser } from './session';

export type UpdateProfileInput = { name: string; email: string; password?: string };
export type UpdateProfileResult = { scope: 'device'; passwordIgnored: boolean };

/**
 * Atualização de cadastro.
 *
 * - Backend REAL: ainda não existe endpoint de atualização de usuário (só login
 *   e cadastro). Recusa a operação e NADA é salvo.
 * - Sessão SIMULADA: nome e e-mail são atualizados SOMENTE neste aparelho (é a
 *   única cópia desses dados). A senha nunca é guardada.
 *
 * Quando o backend tiver o endpoint (ex.: PATCH /users/me), implemente a chamada
 * aqui; a tela não precisa mudar.
 */
export async function updateProfile(input: UpdateProfileInput): Promise<UpdateProfileResult> {
  const session = await getSession();
  if (!session) throw new Error('Sua sessão não está mais ativa. Faça login novamente.');

  if (!session.simulated) {
    throw new FeatureUnavailableError(
      'O backend do TechPath ainda não tem endpoint para atualizar o cadastro. Nada foi salvo.',
    );
  }

  await updateSessionUser({ name: input.name.trim(), email: input.email.trim() });
  return { scope: 'device', passwordIgnored: !!input.password };
}

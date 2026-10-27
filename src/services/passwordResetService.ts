import { FeatureUnavailableError } from './errors';

export type PasswordResetInput = { email: string; newPassword: string };

/**
 * REDEFINIÇÃO DE SENHA — ainda NÃO existe no backend (só há login e cadastro).
 *
 * Por segurança o app NÃO troca a senha de uma conta informando apenas o e-mail:
 * isso permitiria a qualquer pessoa sequestrar contas. Enquanto o backend não
 * tiver um fluxo com verificação de identidade, esta função recusa a operação e
 * nada é alterado.
 *
 * PREPARADO PARA INTEGRAÇÃO (proposta, ajustar ao contrato real):
 *   1) POST /users/forgot-password  { email }                    -> envia código/token por e-mail
 *   2) POST /users/reset-password   { email, code, newPassword } -> troca a senha
 * Quando existir, implemente aqui (com `postJson` de authService) e a tela
 * app/reset-password.tsx passa a funcionar sem outras mudanças (adicionando o
 * campo do código, se o Figma ganhar um).
 */
export async function requestPasswordReset(_input: PasswordResetInput): Promise<void> {
  throw new FeatureUnavailableError(
    'O backend do TechPath ainda não tem redefinição de senha com verificação de identidade (código ou token enviado por e-mail). ' +
      'Por segurança, não é permitido trocar a senha informando apenas o e-mail. Sua senha NÃO foi alterada.',
  );
}

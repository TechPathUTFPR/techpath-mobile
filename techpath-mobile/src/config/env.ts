/**
 * Configuração lida de variáveis de ambiente do Expo (prefixo EXPO_PUBLIC_).
 *
 * ATENÇÃO: variáveis EXPO_PUBLIC_* são embutidas no bundle do app e ficam
 * visíveis para qualquer pessoa. Use apenas para URLs públicas — NUNCA para
 * senhas, chaves secretas ou tokens.
 *
 * O acesso precisa ser `process.env.EXPO_PUBLIC_NOME` (propriedade estática),
 * senão o Expo não consegue substituir o valor no build.
 */
export const env = {
  /**
   * Modo de autenticação do login:
   *  - 'simulated' (PADRÃO, pedido do grupo): NÃO consulta servidor algum. Aceita qualquer e-mail
   *    com "@" e senha de 8+ caracteres. É só para demonstração — nenhuma conta é verificada.
   *  - 'real': usa POST /users/login do backend.
   * Troque com EXPO_PUBLIC_AUTH_MODE=real no .env.local.
   */
  authMode: ((process.env.EXPO_PUBLIC_AUTH_MODE ?? 'simulated').trim().toLowerCase() === 'real'
    ? 'real'
    : 'simulated') as 'real' | 'simulated',
  /** URL base do backend TechPath (sem barra no final). Ex.: http://10.0.2.2:3000 */
  apiUrl: (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/+$/, ''),
  /** URL da página de Termos de Serviço (ainda não definida no projeto web). */
  termsUrl: (process.env.EXPO_PUBLIC_TERMS_URL ?? '').trim(),
  /** URL da página de Política de Privacidade (ainda não definida no projeto web). */
  privacyUrl: (process.env.EXPO_PUBLIC_PRIVACY_URL ?? '').trim(),
};

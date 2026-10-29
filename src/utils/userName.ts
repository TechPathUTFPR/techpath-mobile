/**
 * NOME PROVISÓRIO para o cadastro.
 *
 * O backend (POST /users/register) exige `name`, mas o Figma da tela
 * "Criar Conta" não tem campo de nome. Enquanto isso não for decidido, o nome
 * é derivado da parte local do e-mail (ex.: "joao.silva@x.com" -> "Joao Silva").
 * Para trocar a regra, altere SOMENTE esta função (ou adicione o campo "Nome").
 */
export function deriveNameFromEmail(email: string): string {
  const local = email.trim().split('@')[0] ?? '';
  const words = local
    .replace(/[._\-+]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  const name = words.join(' ').slice(0, 60).trim();
  return name || 'Usuário';
}

/** Primeiro nome para saudações ("Parabéns, Luiz!"). null se não houver nome. */
export function firstName(name: string | null | undefined): string | null {
  const first = name?.trim().split(/\s+/)[0];
  return first ? first : null;
}

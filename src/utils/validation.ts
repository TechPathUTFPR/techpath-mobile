// Formato básico: algo@dominio.tld, sem espaços. A validação "de verdade"
// (conta existente, senha correta) é sempre feita pelo backend.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return 'Informe seu e-mail.';
  if (!EMAIL_REGEX.test(email)) return 'Informe um e-mail válido, como nome@dominio.com.';
  return null;
}

// Só exigimos preenchimento: a regra de tamanho/complexidade da senha pertence
// ao backend e não foi definida no material disponível.
export function validatePassword(value: string): string | null {
  if (!value) return 'Informe sua senha.';
  return null;
}

/**
 * REGRA DE SENHA DO PROJETO: mínimo de 8 caracteres (definida pelo grupo).
 * Vale para Criar Conta, Redefinir Senha, Editar Cadastro e para o Login em
 * modo simulado. No Login em modo real só se exige senha preenchida (contas
 * antigas podem ter outra regra). Se o backend exigir mais, a mensagem dele é exibida.
 */
export const MIN_PASSWORD_LENGTH = 8;

export function validateNewPassword(value: string): string | null {
  if (!value) return 'Informe uma senha.';
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  return null;
}

export function validatePasswordConfirmation(password: string, confirmation: string): string | null {
  if (!confirmation) return 'Confirme sua senha.';
  if (password !== confirmation) return 'As senhas não coincidem.';
  return null;
}

/**
 * LOGIN — regras pedidas pelo grupo para o modo simulado:
 * e-mail = "algo com @" (sem checar domínio/existência) e senha com 8+ caracteres.
 */
export function validateLoginEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return 'Informe seu e-mail.';
  if (!/^.+@.+$/.test(email)) return 'Informe um e-mail contendo "@".';
  return null;
}

export function validateLoginPassword(value: string, simulated: boolean): string | null {
  if (!value) return 'Informe sua senha.';
  if (simulated && value.length < MIN_PASSWORD_LENGTH) {
    return `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  return null;
}

/** Nome obrigatório (Editar Cadastro). */
export function validateName(value: string): string | null {
  const name = value.trim();
  if (!name) return 'Informe seu nome.';
  if (name.length > 60) return 'O nome deve ter no máximo 60 caracteres.';
  return null;
}

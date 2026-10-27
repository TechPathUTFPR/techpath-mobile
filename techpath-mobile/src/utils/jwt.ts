const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64UrlToBytes(input: string): number[] {
  const s = input.replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '');
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const ch of s) {
    const v = B64.indexOf(ch);
    if (v < 0) throw new Error('base64 inválido');
    buffer = (buffer << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
    buffer &= (1 << bits) - 1;
  }
  return bytes;
}

/**
 * Lê o payload de um JWT SEM verificar a assinatura.
 * Serve apenas para EXIBIR dados (nome/e-mail) na interface — nunca para
 * decidir permissões. Quem valida o token de verdade é o backend.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const bytes = base64UrlToBytes(parts[1]);
    const json = decodeURIComponent(bytes.map((b) => '%' + b.toString(16).padStart(2, '0')).join(''));
    const data: unknown = JSON.parse(json);
    return data !== null && typeof data === 'object' ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

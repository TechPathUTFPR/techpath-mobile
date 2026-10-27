/**
 * Tokens visuais da tela de Login.
 *
 * Valores estimados a partir da imagem do Figma (frame de ~390pt de largura).
 * Cores de borda/divisor/texto claro foram corrigidas para compensar o
 * anti-aliasing da imagem exportada. Para fidelidade total, confira cada valor
 * no Figma (Dev Mode / Inspect) e ajuste aqui — é o único lugar a alterar.
 */
export const colors = {
  background: '#FFFFFF',
  textPrimary: '#000000',
  textStrong: '#404040',
  textMuted: '#A8A8A8',
  textLink: '#4C4C4C',
  textFooter: '#8A8A8A',
  textFooterLink: '#303030',
  placeholder: '#8E8E8E',
  inputBackground: '#FFFFFF',
  inputBorder: '#DEDEDE',
  divider: '#E6E6E6',
  dividerLabel: '#B0B0B0',
  buttonPrimaryBg: '#000000',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondaryBg: '#EEEEEE',
  buttonSecondaryText: '#0F0F0F',
  // Estados que não existem no Figma, mas são necessários para validação:
  error: '#D93025',
};

export const layout = {
  screenPaddingHorizontal: 24,
  controlHeight: 44,
  controlRadius: 8,
  inputPaddingHorizontal: 13,
  logoWidth: 125,
  logoHeight: 112,
};

export const fontSizes = {
  title: 16,
  input: 14,
  button: 14,
  link: 11,
  footer: 12,
  error: 12,
};

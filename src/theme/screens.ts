/**
 * Medidas das telas Criar Conta e Meu Perfil (estimadas a partir do Figma,
 * frame de ~390pt de largura). Ficam separadas de tokens.ts para não
 * sobrescrever ajustes que você já tenha feito na tela de Login.
 */
export const registerLayout = {
  contentPaddingTop: 60, // igual ao Login (logo na mesma posição)
  contentPaddingBottom: 71, // ancora o bloco inferior como no Figma (iPhone 14: sobra ~186 entre logo e formulário)
  spacerMinHeight: 48, // espaço entre a logo e o formulário (cresce em telas altas)
  labelFontSize: 16,
  labelLineHeight: 20,
  labelGap: 8,
  fieldGap: 4,
  submitTop: 22, // 26 do Figma menos os 4 de fieldGap do último campo
  switchTop: 10,
  switchFontSize: 11,
  switchLinkFontSize: 10,
  switchLineHeight: 15,
};

export const profileLayout = {
  headerHeight: 44,
  backIconSize: 30,
  backLeft: 26,
  titleTop: 19,
  titleFontSize: 18,
  avatarSize: 124,
  avatarTop: 28,
  nameFontSize: 16,
  nameTop: 6,
  cardsTop: 35,
  cardHeight: 68,
  cardGap: 20,
  cardRadius: 12,
  cardMarginHorizontal: 10,
  cardPaddingHorizontal: 18,
  cardFontSize: 22,
  pencilSize: 24,
  pencilOffsetX: 46, // deslocamento do centro do lápis em relação ao centro da foto
  pencilOffsetY: -38,
  footerPaddingBottom: 8,
};

export const screenColors = {
  switchText: '#8F8F8F', // "Já possui uma conta?"
  switchLink: '#262626', // "Entre aqui"
  avatarBackground: '#E9E9E9',
  avatarGlyph: '#BDBDBD',
  passwordToggle: '#B5B5B5',
};

// ---------------------------------------------------------------------------
// Landing, Como Funciona, Redefinir Senha, Editar Cadastro (medidas do Figma)
// ---------------------------------------------------------------------------
export const brandColors = {
  lilac: '#E7D7FE', // fundo das telas de apresentação
  purple: '#5816B7', // botão "Começar"
  textSoft: '#1D1B20', // "Como Funciona"
};

export const landingLayout = {
  // topo da caixa da logo = 31,9% da altura da tela (no Figma: 269 de 844)
  logoTopRatio: 0.319,
  logoWidth: 158,
  footerPaddingBottom: 12,
};

export const howItWorksLayout = {
  logoTop: 8,
  logoIconHeight: 27,
  logoWordmarkWidth: 80,
  logoGap: 4,
  subtitleTop: 26,
  subtitleFontSize: 14,
  subtitleLineHeight: 18,
  titleTop: 5,
  titleFontSize: 22,
  titleLineHeight: 29,
  sectionsTop: 41,
  labelFontSize: 15,
  labelLineHeight: 18,
  labelPaddingLeft: 16,
  labelGap: 6,
  cardMinHeight: 100,
  cardRadius: 10,
  cardMarginHorizontal: 12,
  cardPaddingHorizontal: 17,
  cardPaddingVertical: 21,
  cardFontSize: 16,
  cardLineHeight: 19,
  sectionGap: 33,
  footerPaddingBottom: 12,
};

export const resetLayout = {
  contentPaddingTop: 76, // logo um pouco mais baixa que no Login
  formTop: 97,
  emailGap: 24, // espaço maior entre "Email" e "Nova Senha", como no Figma
  fieldGap: 4,
  submitTop: 21,
  contentPaddingBottom: 24,
};

export const editLayout = {
  formTop: 38,
  fieldGap: 6,
  submitTop: 9,
  contentPaddingBottom: 24,
};

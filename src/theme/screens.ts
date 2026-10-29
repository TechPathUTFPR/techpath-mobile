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

// ---------------------------------------------------------------------------
// Questionário, Resultado, Resultado Completo, Etapa Concluída (medidas do Figma)
// ---------------------------------------------------------------------------
export const assessmentColors = {
  progressFill: '#46109B',
  progressTrack: '#A9A7A7',
  tagBorder: '#E0E0E0',
  tagText: '#373737',
  optionSelected: '#E7D7FE', // mesmo lilás do cartão de resultado
  imagePlaceholder: '#1F0F39',
  circleOuter: '#D4FA8E',
  circleInner: '#CCFA77',
  check: '#3A3A3A',
  simulatedBadge: '#B3261E',
};

/** Cabeçalho com logo centralizada (+ "Sair" ou seta de voltar). */
export const brandHeaderLayout = { top: 4, height: 28, exitRight: 36, backLeft: 23 };

export const assessmentLayout = {
  marginHorizontal: 34,
  progressTop: 17,
  progressFont: 12,
  progressLine: 14,
  barTop: 6,
  barHeight: 6,
  tagTop: 31,
  tagHeight: 34,
  tagPaddingHorizontal: 14,
  tagFont: 12,
  questionTop: 4,
  questionFont: 22,
  questionLine: 30,
  optionsTop: 14,
  optionGap: 16,
  optionMinHeight: 68,
  optionRadius: 10,
  optionPaddingHorizontal: 17,
  optionPaddingVertical: 14,
  optionFont: 14,
  footerPaddingHorizontal: 34,
  footerGap: 34,
  footerTop: 8,
  footerPaddingBottom: 22,
};

export const resultLayout = {
  margin: 14,
  titleTop: 52,
  titleFont: 22,
  titleLine: 28,
  subtitleTop: 5,
  subtitleFont: 14,
  subtitleLine: 18,
  introTop: 20,
  introFont: 16,
  introLine: 20,
  cardTop: 21,
  cardRadius: 12,
  cardPaddingHorizontal: 18,
  cardPaddingTop: 16,
  cardPaddingBottom: 28,
  cardMinHeight: 333, // o Figma reserva espaço para a descrição completa
  labelFont: 16,
  labelLine: 20,
  nameTop: 27,
  nameFont: 24,
  nameLine: 31,
  percentTop: 13,
  percentFont: 13,
  percentLine: 16,
  imageSize: 83,
  imageGap: 14,
  descriptionTop: 34,
  descriptionFont: 16,
  descriptionLine: 20,
  footerPaddingHorizontal: 24,
  footerGap: 22,
  footerPaddingBottom: 22,
};

export const detailsLayout = {
  cardMargin: 17,
  cardTop: 30,
  descriptionMargin: 34,
  descriptionTop: 22,
  descriptionFont: 16,
  descriptionLine: 22,
  sectionTop: 28,
  sectionFont: 15,
  sectionLine: 20,
  rowsTop: 18,
  rowGap: 16,
  rowFont: 12,
  rowLine: 14,
  rowBarGap: 4,
  rowBarHeight: 6,
};

export const trailLayout = {
  titleTop: 66,
  titleFont: 23,
  titleLine: 30,
  circleTop: 33,
  circleOuter: 138,
  circleInner: 106,
  textTop: 21,
  textFont: 14,
  textLine: 16,
  nextTop: 100,
  labelFont: 15,
  labelLine: 18,
  labelMargin: 22,
  cardTop: 8,
  cardHeight: 80,
  cardMargin: 16,
  cardRadius: 12,
  cardPadding: 17,
  nameFont: 14,
  descriptionFont: 12,
  progressTop: 29,
  progressFont: 12,
  progressLine: 14,
  progressMargin: 22,
  barTop: 8,
  barHeight: 6,
  barMargin: 16,
  footerPaddingHorizontal: 24,
  footerPaddingBottom: 22,
};

// ---------------------------------------------------------------------------
// Histórico de Resultados (medidas do Figma)
// ---------------------------------------------------------------------------
export const historyLayout = {
  chipsTop: 27, // abaixo do cabeçalho (44)
  chipsMarginHorizontal: 22,
  chipsGap: 8,
  chipHeight: 34,
  chipPaddingHorizontal: 15,
  chipRadius: 8,
  chipFont: 12,
  chipBorder: '#CFCFCF',
  chipSelectedBg: '#E7D7FE',
  chipSelectedBorder: '#B79BEF',
  gridTop: 12,
  gridMarginHorizontal: 22,
  gridGap: 34, // espaço entre as duas colunas
  rowGap: 4, // a linha da data ocupa o vazio que o Figma deixa entre as linhas (passo ≈ 196 dp)
  coverColor: '#1D1037',
  captionTop: 0,
  captionFont: 15,
  captionLine: 18,
  buttonPaddingHorizontal: 28,
  buttonHeight: 42,
  footerPaddingTop: 8,
  footerPaddingBottom: 26,
};

// ---------------------------------------------------------------------------
// Home, Minhas Trilhas, Visão Geral da Trilha, Conteúdo da Etapa (medidas do Figma)
// ---------------------------------------------------------------------------
export const homeLayout = {
  margin: 16,
  greetingTop: 52,
  greetingFont: 22,
  greetingLine: 28,
  subtitleTop: 4,
  subtitleFont: 14,
  subtitleLine: 18,
  cardTop: 27,
  cardRadius: 12,
  cardPadding: 12,
  cardTextInset: 5,
  cardPaddingTop: 16,
  labelFont: 15,
  labelLine: 20,
  dateFont: 12,
  dateLine: 16,
  rowTop: 20,
  buttonTop: 29,
  headingTop: 43,
  headingFont: 22,
  headingLine: 28,
  actionsTop: 25,
  actionHeight: 100,
  actionGap: 10,
  actionRadius: 10,
  actionPaddingHorizontal: 8,
  actionPaddingTop: 8,
  actionTitleFont: 15,
  actionTitleLine: 18,
  actionDescFont: 12,
  actionDescLine: 15,
  actionDescTop: 2,
  bottomPadding: 24,
};

export const trailsLayout = {
  chipsTop: 16,
  chipsMarginHorizontal: 17,
  gridTop: 12,
  gridMarginHorizontal: 20,
  gridGap: 34,
  rowGap: 17,
  captionTop: 4,
  captionFont: 14,
  captionLine: 18,
};

export const overviewLayout = {
  margin: 17,
  titleTop: 23,
  titleFont: 22,
  titleLine: 28,
  cardTop: 15,
  cardPaddingVertical: 16,
  cardPaddingHorizontal: 18,
  progressTop: 22,
  progressFont: 14,
  progressLine: 18,
  barTop: 5,
  barHeight: 6,
  countTop: 5,
  countFont: 11,
  countLine: 14,
  timelineTop: 44,
  columnWidth: 62,
  circle: 27,
  circleLeft: 8,
  lineActive: 3,
  lineIdle: 2,
  stepMinHeight: 81,
  stepGap: 8,
  stepRadius: 10,
  stepPaddingHorizontal: 12,
  stepPaddingTop: 11,
  orderWidth: 21,
  nameFont: 15,
  nameLine: 18,
  descFont: 14,
  descLine: 18,
  descTop: 7,
  chevronRight: 14,
  chevronTop: 12,
  idleColor: '#DDDDDD',
};

export const stepLayout = {
  margin: 16,
  badgeTop: 24,
  titleTop: 1,
  titleFont: 22,
  titleLine: 28,
  descTop: 4,
  descFont: 13,
  descLine: 17,
  sectionTop: 56,
  headingFont: 15,
  headingLine: 18,
  boxTop: 9,
  boxMinHeight: 102,
  boxPadding: 12,
  boxRadius: 10,
  boxFont: 14,
  boxLine: 20,
  section2Top: 12,
  listFont: 14,
  listLine: 22,
  listPaddingVertical: 14,
  footerPaddingHorizontal: 26,
  footerGap: 21,
  footerPaddingTop: 8,
  footerPaddingBottom: 24,
};

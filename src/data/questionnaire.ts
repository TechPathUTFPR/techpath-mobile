/**
 * ===========================================================================
 *  BANCO DE PERGUNTAS DO QUESTIONÁRIO DE AFINIDADE (v1)
 *  Fonte: "TechPath — Especificação do Questionário de Afinidade" (PO @erick).
 * ===========================================================================
 * 30 afirmações, 5 para cada uma das 6 áreas, escala de 5 opções (valor 0–4).
 *
 * ATENÇÃO (RN05/RN10 da especificação): área e peso das perguntas só existem para o
 * CÁLCULO. A interface nunca os exibe — ela recebe apenas { id, texto, opções }
 * (ver `toUiQuestions` em assessmentModel.ts). Na especificação o cálculo e esses
 * dados ficam no BACKEND; aqui estão no app só enquanto os endpoints não existem
 * (ver docs/QUESTIONARIO_RESULTADO.md).
 */

export type AreaDef = {
  /** Identificador fixo (banco, API, códigos das perguntas). */
  code: string;
  name: string;
  /** Descrição exibida no resultado. */
  description: string;
  /** Ordem de cadastro (desempate final). */
  order: number;
  active: boolean;
};

export type ScaleOption = { id: string; label: string; value: number; order: number };

export type BankQuestion = {
  /** Código estável (DEV-01…). Se o sentido mudar, cria-se um código novo. */
  code: string;
  text: string;
  areaCode: string;
  /** Peso da pergunta (1,0 na v1). */
  weight: number;
  active: boolean;
};

export const AREAS: AreaDef[] = [
  {
    code: 'DEV',
    name: 'Desenvolvimento de Software',
    description: 'Constrói sistemas, sites e aplicativos escrevendo código e resolvendo problemas com lógica.',
    order: 1,
    active: true,
  },
  {
    code: 'UX',
    name: 'UX/UI Design',
    description: 'Projeta a experiência e a interface, garantindo que produtos sejam fáceis e agradáveis de usar.',
    order: 2,
    active: true,
  },
  {
    code: 'QA',
    name: 'Qualidade de Software (QA)',
    description: 'Garante que o software funcione corretamente, planejando e executando testes e encontrando falhas.',
    order: 3,
    active: true,
  },
  {
    code: 'DSO',
    name: 'DevSecOps',
    description: 'Automatiza, mantém e protege a infraestrutura, os servidores e o caminho do código até a produção.',
    order: 4,
    active: true,
  },
  {
    code: 'DAD',
    name: 'Análise de Dados',
    description: 'Coleta, organiza e interpreta dados para gerar informações que apoiam decisões.',
    order: 5,
    active: true,
  },
  {
    code: 'PRD',
    name: 'Gestão de Produto',
    description:
      'Define o que será construído e por quê, prioriza demandas e faz a ponte entre negócio, usuários e time técnico.',
    order: 6,
    active: true,
  },
];

/** Escala GPTW de 5 pontos. Sempre nesta ordem. O VALOR nunca aparece para o usuário. */
export const SCALE: ScaleOption[] = [
  { id: 'op-1', label: 'Nunca é verdade', value: 0, order: 1 },
  { id: 'op-2', label: 'Nem sempre é verdade', value: 1, order: 2 },
  { id: 'op-3', label: 'Às vezes é verdade', value: 2, order: 3 },
  { id: 'op-4', label: 'Quase sempre é verdade', value: 3, order: 4 },
  { id: 'op-5', label: 'Sempre é verdade', value: 4, order: 5 },
];

const TEXTS: Record<string, string[]> = {
  DEV: [
    'Gosto de resolver problemas descrevendo, passo a passo, a lógica de como algo deve funcionar.',
    'Sinto satisfação quando consigo fazer algo funcionar depois de muitas tentativas.',
    'Tenho curiosidade em entender como os aplicativos e sites que uso foram construídos.',
    'Consigo ficar concentrado por bastante tempo em uma tarefa que exige raciocínio lógico.',
    'Gosto de aprender novas linguagens, ferramentas ou formas de construir coisas.',
  ],
  UX: [
    'Percebo com facilidade quando um site ou aplicativo é confuso de usar.',
    'Gosto de pensar em como deixar algo mais bonito, organizado e agradável visualmente.',
    'Antes de criar algo, procuro entender as necessidades e dificuldades de quem vai usar.',
    'Gosto de desenhar, rascunhar ou montar protótipos para explicar uma ideia.',
    'Me interesso por cores, tipografia, ícones e composição visual.',
  ],
  QA: [
    'Costumo encontrar erros ou detalhes que outras pessoas deixam passar.',
    'Gosto de testar algo de várias formas diferentes para ver se ele quebra.',
    'Prefiro conferir tudo com cuidado antes de considerar uma tarefa concluída.',
    'Gosto de seguir e criar roteiros, checklists ou procedimentos bem definidos.',
    'Me incomoda entregar algo sem ter certeza de que funciona corretamente.',
  ],
  DSO: [
    'Gosto de automatizar tarefas repetitivas para não precisar fazê-las manualmente.',
    'Tenho interesse em entender como servidores, redes e a nuvem funcionam.',
    'Penso em como proteger sistemas e dados contra ataques ou vazamentos.',
    'Me sinto à vontade usando o terminal (linha de comando) do computador.',
    'Gosto de garantir que um sistema fique estável e funcionando o tempo todo.',
  ],
  DAD: [
    'Gosto de trabalhar com números, planilhas e tabelas.',
    'Tenho curiosidade em descobrir padrões e tendências escondidos em informações.',
    'Prefiro tomar decisões com base em dados e evidências do que na intuição.',
    'Gosto de transformar informações em gráficos ou relatórios fáceis de entender.',
    'Me interesso por estatística, matemática ou inteligência artificial.',
  ],
  PRD: [
    'Gosto de organizar tarefas, prioridades e prazos de um grupo.',
    'Me sinto à vontade conversando com pessoas para entender o que elas precisam.',
    'Gosto de pensar no porquê de um produto existir e no valor que ele entrega.',
    'Costumo mediar opiniões diferentes até o grupo chegar a um acordo.',
    'Me interesso por negócios, mercado e estratégia.',
  ],
};

export const QUESTION_BANK: BankQuestion[] = AREAS.flatMap((area) =>
  (TEXTS[area.code] ?? []).map((text, i) => ({
    code: `${area.code}-${String(i + 1).padStart(2, '0')}`,
    text,
    areaCode: area.code,
    weight: 1,
    active: true,
  })),
);

/** Etiqueta exibida acima do enunciado (no Figma: "Interesses"). NUNCA a área (RN05). */
export const QUESTION_CATEGORY_LABEL = 'Interesses';

/** Uma área só entra se estiver ativa e tiver ao menos 5 perguntas ativas (RN13). */
export const MIN_QUESTIONS_PER_AREA = 5;

/** "Perfil em descoberta": nenhuma área PASSA de 40% (exatamente 40% ainda conta). */
export const DISCOVERY_THRESHOLD = 40;

/** Confere o banco e devolve os problemas (vazio = ok). */
export function validateBank(areas: AreaDef[], bank: BankQuestion[]): string[] {
  const issues: string[] = [];
  const areaCodes = new Set<string>();
  areas.forEach((a) => {
    if (areaCodes.has(a.code)) issues.push(`Área ${a.code}: código repetido.`);
    areaCodes.add(a.code);
  });
  const codes = new Set<string>();
  bank.forEach((q) => {
    if (!q.code.trim()) issues.push('Pergunta sem código.');
    if (codes.has(q.code)) issues.push(`Pergunta ${q.code}: código repetido.`);
    codes.add(q.code);
    if (!q.text.trim()) issues.push(`Pergunta ${q.code}: sem enunciado.`);
    if (!areaCodes.has(q.areaCode)) issues.push(`Pergunta ${q.code}: área ${q.areaCode} não existe.`);
    if (!(q.weight > 0)) issues.push(`Pergunta ${q.code}: peso deve ser maior que zero.`);
  });
  return issues;
}

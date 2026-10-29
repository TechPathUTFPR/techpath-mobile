import { AssessmentResult } from './types';

const join = (names: string[]) =>
  names.length <= 1 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;

/**
 * Mensagens de perfil (especificação): híbrido, em descoberta e respostas uniformes.
 * Devolve só as que se aplicam ao resultado.
 */
export function buildResultNotices(result: AssessmentResult | null): string[] {
  if (!result) return [];
  const notices: string[] = [];
  const principals = result.areas.filter((a) => a.principal).map((a) => a.name);

  if (result.hybrid && principals.length > 1) {
    notices.push(
      principals.length <= 3
        ? `Perfil híbrido: você tem a mesma afinidade com ${join(principals)}.`
        : `Perfil híbrido: sua afinidade é igual entre ${principals.length} áreas.`,
    );
  }
  if (result.inDiscovery) {
    const top = result.areas.slice(0, 2).map((a) => a.name);
    notices.push(
      `Você ainda não tem uma preferência forte por uma área. Explore as duas primeiras do ranking: ${join(top)}.`,
    );
  }
  if (result.uniformAnswers) {
    notices.push('Você escolheu a mesma opção em todas as perguntas. Considere refazer o questionário com mais atenção.');
  }
  return notices;
}

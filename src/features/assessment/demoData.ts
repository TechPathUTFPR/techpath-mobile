import { AssessmentResult } from './types';

/**
 * DADOS SIMULADOS — só para testar as telas de resultado. Os valores replicam o
 * exemplo do Figma e NÃO vêm de nenhuma avaliação real. Marcados com `simulated`,
 * a interface exibe um aviso quando estes dados estão na tela.
 */
export function buildDemoResult(): AssessmentResult {
  return {
    id: 'demo-avaliacao',
    completedAt: new Date().toISOString(),
    simulated: true,
    trailId: 'demo-trilha',
    areas: [
      {
        areaId: 'DEV',
        name: 'Engenharia de Software',
        percent: 92,
        description:
          'Seu perfil demonstra forte interesse nesta área. (Texto de exemplo — dados simulados para teste da interface.)',
      },
      { areaId: 'UX', name: 'UX/UI', percent: 50 },
      { areaId: 'DSO', name: 'DevOps', percent: 50 },
      { areaId: 'QA', name: 'QA', percent: 50 },
    ],
  };
}

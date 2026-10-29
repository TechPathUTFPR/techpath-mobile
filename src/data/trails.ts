import { TrailDef, TrailStepDef } from '../features/trail/types';
import { AREAS, AreaDef } from './questionnaire';

/**
 * ===========================================================================
 *  CATÁLOGO DE TRILHAS  —  DADOS DE EXEMPLO (arquivo para VOCÊ substituir)
 * ===========================================================================
 * Não foi encontrado, no GitHub do TechPath (README do backend; as pastas de código
 * estão bloqueadas), nenhum modelo de trilha, etapa, conteúdo ou progresso — a própria
 * especificação do PO diz que as trilhas têm especificação própria.
 *
 * Por isso há UMA trilha de exemplo por área (a trilha recomendada é a da área principal
 * do resultado), com número de etapas e de tópicos DIFERENTES, para testar a interface com
 * tamanhos variados. Todo o texto é obviamente de exemplo e as telas exibem o aviso
 * "CONTEÚDO DE EXEMPLO" enquanto TRAILS_ARE_SAMPLE for true.
 *
 * Para usar o conteúdo real: substitua TRAILS por uma lista no formato TrailDef
 * (src/features/trail/types.ts) e ponha TRAILS_ARE_SAMPLE = false.
 * Ids de trilha e de etapa devem ser únicos e estáveis (o progresso é guardado por eles).
 */
export const TRAILS_ARE_SAMPLE = true;

const SAMPLE_STEP_COUNT: Record<string, number> = { DEV: 6, UX: 4, QA: 5, DSO: 8, DAD: 5, PRD: 4 };

function sampleStep(trailId: string, n: number): TrailStepDef {
  const topicCount = 3 + (n % 5); // 3 a 7 tópicos
  return {
    id: `${trailId}-e${n}`,
    title: `Etapa de exemplo ${n}`,
    description: 'Descrição de exemplo da etapa.',
    whyImportant: 'Texto de exemplo. O conteúdo oficial desta etapa ainda não foi cadastrado.',
    topics: Array.from({ length: topicCount }, (_, i) => `Tópico de exemplo ${i + 1}`),
  };
}

function sampleTrail(area: AreaDef): TrailDef {
  const id = `trilha-${area.code.toLowerCase()}`;
  const count = SAMPLE_STEP_COUNT[area.code] ?? 4;
  return {
    id,
    areaCode: area.code,
    name: `Trilha ${area.name}`,
    areaName: area.name,
    steps: Array.from({ length: count }, (_, i) => sampleStep(id, i + 1)),
  };
}

export const TRAILS: TrailDef[] = AREAS.map(sampleTrail);

export const getTrail = (id: string | undefined | null): TrailDef | null =>
  (id ? TRAILS.find((t) => t.id === id) : undefined) ?? null;

/** Trilha recomendada para uma área (código). */
export const trailForArea = (areaCode: string | undefined | null): TrailDef | null =>
  (areaCode ? TRAILS.find((t) => t.areaCode === areaCode) : undefined) ?? null;

/** Confere o catálogo (ids únicos etc.). Vazio = ok. */
export function validateTrails(trails: TrailDef[]): string[] {
  const issues: string[] = [];
  const trailIds = new Set<string>();
  trails.forEach((t) => {
    if (!t.id.trim()) issues.push('Trilha sem id.');
    if (trailIds.has(t.id)) issues.push(`Trilha ${t.id}: id repetido.`);
    trailIds.add(t.id);
    const stepIds = new Set<string>();
    t.steps.forEach((s) => {
      if (!s.id.trim()) issues.push(`Trilha ${t.id}: etapa sem id.`);
      if (stepIds.has(s.id)) issues.push(`Trilha ${t.id}: etapa ${s.id} com id repetido.`);
      stepIds.add(s.id);
      if (!s.title.trim()) issues.push(`Trilha ${t.id}, etapa ${s.id}: sem título.`);
    });
  });
  return issues;
}

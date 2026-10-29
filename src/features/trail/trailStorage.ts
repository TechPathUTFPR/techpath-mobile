import { KeyValueStorage } from '../assessment/storage';
import { ProgressStore, TrailStore } from './types';

const KEY_PREFIX = 'techpath.trails.v1:';

export const emptyTrailStore = (): TrailStore => ({ version: 1, progress: {} });

/** Mantém só entradas bem formadas: trailId -> (stepId -> texto de data). */
function cleanProgress(raw: unknown): ProgressStore {
  const out: ProgressStore = {};
  if (typeof raw !== 'object' || raw === null) return out;
  Object.entries(raw as Record<string, unknown>).forEach(([trailId, steps]) => {
    if (typeof steps !== 'object' || steps === null) return;
    const clean: Record<string, string> = {};
    Object.entries(steps as Record<string, unknown>).forEach(([stepId, at]) => {
      if (typeof at === 'string') clean[stepId] = at;
    });
    out[trailId] = clean;
  });
  return out;
}

/** Lê o progresso do usuário. Ausente ou corrompido => vazio (nunca quebra o app). */
export async function loadTrailStore(storage: KeyValueStorage, userKey: string): Promise<TrailStore> {
  const raw = await storage.getItem(KEY_PREFIX + userKey);
  if (!raw) return emptyTrailStore();
  try {
    const data = JSON.parse(raw) as Partial<TrailStore>;
    if (data.version !== 1) return emptyTrailStore();
    return { version: 1, progress: cleanProgress(data.progress) };
  } catch {
    return emptyTrailStore();
  }
}

export async function saveTrailStore(storage: KeyValueStorage, userKey: string, store: TrailStore): Promise<void> {
  await storage.setItem(KEY_PREFIX + userKey, JSON.stringify(store));
}

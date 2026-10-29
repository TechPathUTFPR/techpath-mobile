import { StoredAssessment, UserStore } from './types';

/** Interface mínima de armazenamento (AsyncStorage no app; em memória nos testes). */
export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const KEY_PREFIX = 'techpath.assessments.v1:';

export const emptyStore = (): UserStore => ({ version: 1, inProgress: null, history: [] });

const isAssessment = (a: unknown): a is StoredAssessment => {
  if (typeof a !== 'object' || a === null) return false;
  const x = a as Partial<StoredAssessment>;
  return (
    typeof x.id === 'string' &&
    Array.isArray(x.order) &&
    typeof x.answers === 'object' &&
    x.answers !== null &&
    typeof x.index === 'number'
  );
};

/** Lê os dados do usuário. Dado ausente ou corrompido => armazenamento vazio (nunca quebra o app). */
export async function loadUserStore(storage: KeyValueStorage, userKey: string): Promise<UserStore> {
  const raw = await storage.getItem(KEY_PREFIX + userKey);
  if (!raw) return emptyStore();
  try {
    const data = JSON.parse(raw) as Partial<UserStore>;
    if (data.version !== 1 || !Array.isArray(data.history)) return emptyStore();
    return {
      version: 1,
      inProgress: isAssessment(data.inProgress) ? data.inProgress : null,
      history: data.history.filter(isAssessment).filter((a) => a.status === 'CONCLUIDA' && !!a.result),
    };
  } catch {
    return emptyStore();
  }
}

export async function saveUserStore(storage: KeyValueStorage, userKey: string, store: UserStore): Promise<void> {
  await storage.setItem(KEY_PREFIX + userKey, JSON.stringify(store));
}

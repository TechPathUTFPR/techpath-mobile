/** Funcionalidade que ainda não existe no backend/app. Nada foi alterado de verdade. */
export class FeatureUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FeatureUnavailableError';
  }
}

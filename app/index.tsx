import { Redirect } from 'expo-router';

/**
 * Ponto de entrada: o app SEMPRE abre no Login (mesmo que haja uma sessão antiga salva).
 * Depois do login (ou do cadastro) o destino é decidido por `useGoToStart`:
 *   - sem resultados salvos  -> /landing
 *   - com resultados salvos  -> /home
 */
export default function Index() {
  return <Redirect href="/login" />;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyValueStorage } from './storage';

/**
 * Armazenamento persistente do app (AsyncStorage).
 * Dependência adicionada: @react-native-async-storage/async-storage — o SecureStore tem
 * limite de ~2 KB por valor e o histórico de avaliações ultrapassa isso.
 * Aqui NÃO ficam senhas nem tokens (esses seguem no SecureStore).
 */
export const asyncKeyValueStorage: KeyValueStorage = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key),
};

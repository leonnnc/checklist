import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from '../types';
import { INITIAL_DATA } from '../data/initialData';

const STORAGE_KEY = 'depa804_data';

export async function loadData(): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as AppData;
    }
    // Primera vez: guardar y retornar datos iniciales
    await saveData(INITIAL_DATA);
    return INITIAL_DATA;
  } catch {
    return INITIAL_DATA;
  }
}

export async function saveData(data: AppData): Promise<void> {
  try {
    const updated = { ...data, ultimaActualizacion: new Date().toISOString() };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error guardando datos:', e);
  }
}

export async function resetData(): Promise<AppData> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  await saveData(INITIAL_DATA);
  return INITIAL_DATA;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_CONFIG} from '../config/appConfig';
import type {PresenceRecord} from '../types/presence';

export const PresenceStorage = {
  async getAll(): Promise<PresenceRecord[]> {
    const raw = await AsyncStorage.getItem(APP_CONFIG.storageKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as PresenceRecord[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async save(record: PresenceRecord): Promise<void> {
    const current = await PresenceStorage.getAll();
    const updated = [record, ...current];
    await AsyncStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(updated));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(APP_CONFIG.storageKey);
  },
};

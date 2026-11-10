import AsyncStorage from '@react-native-async-storage/async-storage';
import { plants } from './plantService';
const KEY = '@verdant/favorites/v1';
export async function readFavorites() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.some((id) => typeof id !== 'string'))
    throw new Error('Saved collection is unreadable.');
  return [...new Set(parsed.filter((id) => plants.some((p) => p.id === id)))];
}
export async function writeFavorites(ids) {
  await AsyncStorage.setItem(KEY, JSON.stringify(ids));
}

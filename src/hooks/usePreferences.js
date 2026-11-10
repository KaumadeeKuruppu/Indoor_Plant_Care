import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export function usePreferences() {
  const [name, setName] = useState('Plant Lover'),
    [error, setError] = useState(null),
    [ready, setReady] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem('@verdant/name/v1')
      .then((v) => {
        if (v) setName(v);
      })
      .catch(() => setError('Could not load your preferences.'))
      .finally(() => setReady(true));
  }, []);
  const saveName = async (value) => {
    try {
      const next = value.trim().slice(0, 30) || 'Plant Lover';
      await AsyncStorage.setItem('@verdant/name/v1', next);
      setName(next);
      setError(null);
      return true;
    } catch {
      setError('Could not save your name. Please try again.');
      return false;
    }
  };
  return { name, saveName, error, ready };
}

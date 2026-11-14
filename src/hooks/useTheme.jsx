import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Appearance, Platform, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { palettes } from '../constants/theme';
import { createUiStyles } from '../constants/uiStyles';

const ThemeContext = createContext(null);
const THEME_KEY = '@plantcare/theme/v1';
const themes = Object.fromEntries(
  Object.entries(palettes).map(([mode, colors]) => [
    mode,
    { colors, styles: createUiStyles(colors) },
  ]),
);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const savingRef = useRef(false);

  useEffect(() => {
    let live = true;
    AsyncStorage.getItem(THEME_KEY)
      .then((stored) => {
        if (live && (stored === 'light' || stored === 'dark')) setMode(stored);
      })
      .catch(() => {
        if (live)
          setError('Could not load your appearance. Toggle the theme to save a new preference.');
      })
      .finally(() => {
        if (live) setReady(true);
      });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (ready && Platform.OS !== 'web') Appearance.setColorScheme(mode);
  }, [mode, ready]);

  const value = useMemo(
    () => ({
      mode,
      ...themes[mode],
      ready,
      saving,
      error,
      toggleTheme: async () => {
        if (!ready || savingRef.current) return;
        savingRef.current = true;
        setSaving(true);
        setError(null);
        const next = mode === 'dark' ? 'light' : 'dark';
        // Keep the current theme if saving fails, so the icon can safely retry.
        try {
          await AsyncStorage.setItem(THEME_KEY, next);
          setMode(next);
        } catch {
          setError('Could not save your appearance. Tap the theme icon to try again.');
        } finally {
          savingRef.current = false;
          setSaving(false);
        }
      },
    }),
    [mode, ready, saving, error],
  );

  return (
    <ThemeContext.Provider value={value}>
      {ready ? children : <View style={{ flex: 1, backgroundColor: palettes.dark.bg }} />}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('ThemeProvider is missing');
  return theme;
}

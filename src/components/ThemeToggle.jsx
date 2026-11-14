import React from 'react';
import { Image, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const icons = {
  light: require('../../assets/illustrations/sun.png'),
  dark: require('../../assets/illustrations/moon.png'),
};

export function ThemeToggle() {
  const { mode, colors: c, styles: s, toggleTheme, ready, saving } = useTheme();
  const next = mode === 'dark' ? 'light' : 'dark';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${next} mode`}
      accessibilityHint={`Current appearance is ${mode} mode`}
      accessibilityState={{ disabled: !ready || saving, busy: saving }}
      disabled={!ready || saving}
      onPress={() => {
        void toggleTheme();
      }}
      style={({ pressed }) => [s.iconButton, { opacity: pressed || saving ? 0.6 : 1 }]}
    >
      <Image
        source={icons[next]}
        accessible={false}
        style={{ width: 22, height: 22, tintColor: c.text }}
      />
    </Pressable>
  );
}

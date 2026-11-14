import { useTheme } from '../hooks/useTheme';
import React from 'react';
import { Text, View } from 'react-native';
import { useFavorites } from '../hooks/useFavorites';
import { Button } from './ui';
export function StorageNotice() {
  const { styles: s } = useTheme();
  const { error, retry } = useFavorites();
  return error ? (
    <View style={{ gap: 12, marginBottom: 20 }}>
      <Text accessibilityRole="alert" style={s.body}>
        {error}
      </Text>
      <Button label="Retry collection" onPress={retry} secondary />
    </View>
  ) : null;
}

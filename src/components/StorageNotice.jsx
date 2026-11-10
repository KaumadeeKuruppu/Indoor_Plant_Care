import React from 'react';
import { Text, View } from 'react-native';
import { useFavorites } from '../hooks/useFavorites';
import { Button, s } from './ui';
export function StorageNotice() {
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

import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { PlantCard } from './PlantCard';
export function PlantGrid({ plants }) {
  const { width } = useWindowDimensions();
  const columns = width >= 780 ? 3 : 2;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      {plants.map((p) => (
        <View key={p.id} style={{ width: columns === 3 ? '31.8%' : '48%', flexGrow: 0 }}>
          <PlantCard plant={p} compact />
        </View>
      ))}
    </View>
  );
}

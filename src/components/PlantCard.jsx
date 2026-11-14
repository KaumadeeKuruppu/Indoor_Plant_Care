import { useTheme } from '../hooks/useTheme';
import React, { useMemo } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { lightLabels } from '../constants/theme';
import { plantImages } from '../constants/images';
import { useFavorites } from '../hooks/useFavorites';
import { Icon, IconButton } from './ui';
export function PlantCard({ plant, compact = false }) {
  const { colors: c, styles: s } = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);
  const { ids, toggle, loading, error } = useFavorites(),
    saved = ids.includes(plant.id);
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={'View ' + plant.name}
        onPress={() => router.push({ pathname: '/plant/[id]', params: { id: plant.id } })}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <Image
          source={plantImages[plant.image]}
          style={[styles.image, compact && { height: 150 }]}
          resizeMode="cover"
          accessibilityLabel={plant.name}
        />
        <View style={styles.info}>
          <Text numberOfLines={2} style={styles.name}>
            {plant.name}
          </Text>
          <Text numberOfLines={1} style={styles.scientific}>
            {plant.scientificName}
          </Text>
          <View style={styles.meta}>
            <Icon name="sunny-outline" size={13} />
            <Text style={s.small}>{lightLabels[plant.sunlight]}</Text>
          </View>
          <View style={styles.meta}>
            <Icon
              name={plant.petFriendly ? 'paw-outline' : 'alert-circle-outline'}
              size={13}
              color={plant.petFriendly ? c.accent : c.warning}
            />
            <Text style={[s.small, { fontSize: 10 }]}>
              {plant.petFriendly ? 'Pet friendly' : 'Keep from pets'}
            </Text>
          </View>
        </View>
      </Pressable>
      <View style={styles.favorite}>
        <IconButton
          label={(saved ? 'Unsave ' : 'Save ') + plant.name}
          name={saved ? 'heart' : 'heart-outline'}
          active={saved}
          disabled={loading || !!error}
          onPress={() => {
            void toggle(plant.id);
          }}
        />
      </View>
    </View>
  );
}
const createStyles = (c) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.card,
      borderRadius: 22,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: c.border,
    },
    image: { width: '100%', height: 200 },
    info: { padding: 15, gap: 6 },
    name: { fontSize: 15, fontWeight: '600', color: c.text },
    scientific: { fontSize: 10, fontStyle: 'italic', color: c.muted },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
    favorite: { position: 'absolute', top: 10, right: 10 },
  });

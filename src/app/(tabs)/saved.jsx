import { useTheme } from '../../hooks/useTheme';
import React, { useState } from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { Screen, Heading, SearchBar, Empty } from '../../components/ui';
import { PlantGrid } from '../../components/PlantGrid';
import { StorageNotice } from '../../components/StorageNotice';
import { useFavorites } from '../../hooks/useFavorites';
import { plants } from '../../services/plantService';
export default function Saved() {
  const { styles: s } = useTheme();
  const { ids, loading, error } = useFavorites(),
    [query, setQuery] = useState('');
  const saved = plants.filter((p) => ids.includes(p.id)),
    filtered = saved.filter((p) =>
      (p.name + ' ' + p.scientificName).toLowerCase().includes(query.trim().toLowerCase()),
    );
  return (
    <Screen>
      <Heading
        eyebrow="COLLECT WHAT YOU LOVE"
        title={'My green\ncollection.'}
        subtitle="Your favorite plants, all in one place."
      />
      <StorageNotice />
      {loading ? (
        <Text style={s.body}>Opening your collection…</Text>
      ) : (
        !error &&
        (!saved.length ? (
          <Empty
            title="No plants saved yet."
            body="Start exploring and build your own little jungle."
            onPress={() => router.push('/explore')}
          />
        ) : (
          <>
            <SearchBar value={query} onChange={setQuery} placeholder="Search your saved plants" />
            <Text style={[s.small, { marginBottom: 18 }]}>
              {filtered.length} of {saved.length} saved companions
            </Text>
            {filtered.length ? (
              <PlantGrid plants={filtered} />
            ) : (
              <Empty
                title="No matching companions."
                body="Try a different common or scientific name."
                label="Clear search"
                onPress={() => setQuery('')}
              />
            )}
          </>
        ))
      )}
    </Screen>
  );
}

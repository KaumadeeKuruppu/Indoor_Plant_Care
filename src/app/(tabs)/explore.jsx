import { useTheme } from '../../hooks/useTheme';
import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  Screen,
  Heading,
  SearchBar,
  Chip,
  Button,
  Sheet,
  Empty,
  Eyebrow,
} from '../../components/ui';
import { PlantGrid } from '../../components/PlantGrid';
import { StorageNotice } from '../../components/StorageNotice';
import { plants } from '../../services/plantService';
import { emptyFilters, filterPlants } from '../../utils/plantFilters';
import { filterOptions } from '../../constants/theme';
export default function Explore() {
  const { category } = useLocalSearchParams();
  return <ExploreContent key={category || 'all'} category={category} />;
}
function categoryFilters(category) {
  const f = emptyFilters();
  if (category === 'low') f.sunlight = ['low'];
  if (category === 'easy') f.difficulty = ['easy'];
  if (category === 'pets') f.pets = ['safe'];
  if (category === 'air') f.categories = ['air'];
  return f;
}
function ExploreContent({ category }) {
  const { colors: c, styles: s } = useTheme();
  const [query, setQuery] = useState(''),
    [filters, setFilters] = useState(() => categoryFilters(category)),
    [draft, setDraft] = useState(emptyFilters),
    [open, setOpen] = useState(false);
  const result = useMemo(() => filterPlants(plants, query, filters), [query, filters]);
  const active = Object.keys(filters).flatMap((group) =>
    filters[group].map((id) => ({
      group,
      id,
      label: filterOptions[group].find((o) => o.id === id)?.label || id,
    })),
  );
  const toggle = (group, id) =>
    setDraft((f) => ({
      ...f,
      [group]: f[group].includes(id) ? f[group].filter((v) => v !== id) : [...f[group], id],
    }));
  const clear = () => {
    setFilters(emptyFilters());
    setQuery('');
  };
  return (
    <Screen>
      <Heading
        eyebrow="THE PLANT LIBRARY"
        title={'Find your\nperfect plant.'}
        subtitle="A greener home starts with the right companion."
      />
      <StorageNotice />
      <SearchBar value={query} onChange={setQuery} placeholder="Search common or scientific name" />
      <View style={[s.row, { marginBottom: 16 }]}>
        <Text style={s.small}>{result.length} plants to discover</Text>
        <Button
          label={'Filters' + (active.length ? ' · ' + active.length : '')}
          secondary
          icon="options-outline"
          onPress={() => {
            setDraft(filters);
            setOpen(true);
          }}
        />
      </View>
      {!!active.length && (
        <View style={[s.wrap, { marginBottom: 18 }]}>
          {active.map((a) => (
            <Chip
              key={a.group + a.id}
              label={a.label + ' ×'}
              selected
              onPress={() =>
                setFilters((f) => ({ ...f, [a.group]: f[a.group].filter((id) => id !== a.id) }))
              }
            />
          ))}
          <Chip label="Clear All" onPress={clear} />
        </View>
      )}
      {filters.categories.includes('air') && (
        <Text style={[s.small, { marginBottom: 16 }]}>
          Plants are lovely companions, but do not replace room ventilation or air filtration.
        </Text>
      )}
      {result.length ? (
        <PlantGrid plants={result} />
      ) : (
        <Empty
          title="No plants found."
          body="Try a different name or give your filters a little more room."
          label="Clear search & filters"
          onPress={clear}
        />
      )}
      <Sheet visible={open} onClose={() => setOpen(false)} title="Make it your kind of green">
        <Text style={s.body}>
          Combine different care needs. Choices within a group match any selected option; additional
          categories all apply.
        </Text>
        {Object.keys(filterOptions).map((group) => (
          <View key={group} style={{ gap: 12 }}>
            <Eyebrow>
              {
                {
                  sunlight: 'SUNLIGHT',
                  pets: 'PET SAFETY',
                  difficulty: 'CARE DIFFICULTY',
                  watering: 'WATERING',
                  categories: 'A LITTLE MORE YOU',
                }[group]
              }
            </Eyebrow>
            <View style={s.wrap}>
              {filterOptions[group].map((option) => (
                <Chip
                  key={option.id}
                  label={option.label}
                  selected={draft[group].includes(option.id)}
                  onPress={() => toggle(group, option.id)}
                />
              ))}
            </View>
          </View>
        ))}
        <Text style={{ color: c.sub, fontSize: 12 }}>
          {filterPlants(plants, query, draft).length} matching plants
        </Text>
        <Button
          label="Apply Filters"
          icon="checkmark"
          onPress={() => {
            setFilters(draft);
            setOpen(false);
          }}
        />
        <Button label="Clear All" secondary onPress={() => setDraft(emptyFilters())} />
      </Sheet>
    </Screen>
  );
}

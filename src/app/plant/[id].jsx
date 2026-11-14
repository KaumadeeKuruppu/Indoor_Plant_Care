import { useTheme } from '../../hooks/useTheme';
import React, { useState } from 'react';
import { View, Text, Image, Share, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Screen,
  IconButton,
  Glass,
  Icon,
  Section,
  Eyebrow,
  Button,
  Empty,
  Sheet,
} from '../../components/ui';
import { StorageNotice } from '../../components/StorageNotice';
import { getPlant, getPlantIssues } from '../../services/plantService';
import { useFavorites } from '../../hooks/useFavorites';
import { lightLabels, fonts } from '../../constants/theme';
import { plantImages } from '../../constants/images';
export default function PlantDetails() {
  const { colors: c, styles: s } = useTheme();
  const { id } = useLocalSearchParams(),
    plant = getPlant(id),
    { ids, toggle, loading, error } = useFavorites(),
    [shareOpen, setShareOpen] = useState(false),
    [shareError, setShareError] = useState('');
  const back = () => (router.canGoBack() ? router.back() : router.replace('/explore'));
  if (!plant)
    return (
      <Screen>
        <Empty
          title="Plant not found."
          body="This plant is not in the offline library."
          label="Back to Explore"
          onPress={() => router.replace('/explore')}
        />
      </Screen>
    );
  const saved = ids.includes(plant.id);
  const plantIssues = getPlantIssues(plant);
  const shareText =
    plant.name +
    ' (' +
    plant.scientificName +
    ')\n' +
    lightLabels[plant.sunlight] +
    ' · Water approximately every ' +
    plant.wateringFrequency +
    '.\n' +
    plant.wateringGuidance +
    '\n' +
    (plant.petFriendly ? 'Non-toxic to cats and dogs.' : 'Keep away from cats and dogs.') +
    '\nFrom PlantCare — Indoor Plant Care & Doctor.';
  const share = async () => {
    if (Platform.OS === 'web') {
      setShareOpen(true);
      return;
    }
    try {
      await Share.share({ message: shareText, title: plant.name });
    } catch {
      setShareError('Sharing is unavailable. You can select and copy this care summary.');
      setShareOpen(true);
    }
  };
  const care = [
    ['sunny-outline', 'Sunlight', lightLabels[plant.sunlight]],
    ['water-outline', 'Watering', 'Every ' + plant.wateringFrequency],
    ['leaf-outline', 'Soil', plant.soil],
    ['cloud-outline', 'Humidity', plant.humidity.replace('-', ' to ')],
    ['thermometer-outline', 'Temperature', plant.temperature],
    ['flask-outline', 'Fertilizer', plant.fertilizer],
    ['trending-up-outline', 'Growth rate', plant.growthRate],
    ['sparkles-outline', 'Difficulty', plant.difficulty],
  ];
  return (
    <Screen>
      <View style={[s.row, { marginBottom: 18 }]}>
        <IconButton name="arrow-back" label="Back" onPress={back} />
        <Eyebrow>PLANT PORTRAIT</Eyebrow>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <IconButton
            name="share-outline"
            label="Share plant"
            onPress={() => {
              void share();
            }}
          />
          <IconButton
            name={saved ? 'heart' : 'heart-outline'}
            label={(saved ? 'Unsave ' : 'Save ') + plant.name}
            active={saved}
            disabled={loading || !!error}
            onPress={() => {
              void toggle(plant.id);
            }}
          />
        </View>
      </View>
      <StorageNotice />
      <View
        style={{
          borderRadius: 28,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: c.border,
          marginBottom: 24,
        }}
      >
        <Image
          source={plantImages[plant.image]}
          style={{ width: '100%', height: 365 }}
          resizeMode="cover"
          accessibilityLabel={plant.name}
        />
      </View>
      <Text style={{ color: c.accent, fontSize: 12, fontStyle: 'italic', marginBottom: 9 }}>
        {plant.scientificName}
      </Text>
      <Text accessibilityRole="header" style={[s.title, { fontSize: 36, lineHeight: 42 }]}>
        {plant.name}
      </Text>
      <View style={[s.wrap, { marginTop: 16, marginBottom: 18 }]}>
        <View style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }}>
          <Icon name="sparkles-outline" size={15} />
          <Text style={s.small}>{plant.difficulty} care</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }}>
          <Icon name="paw-outline" size={15} color={plant.petFriendly ? c.accent : c.warning} />
          <Text style={[s.small, { color: plant.petFriendly ? c.accent : c.warning }]}>
            {plant.petFriendly ? 'Pet friendly' : 'Toxic to pets'}
          </Text>
        </View>
      </View>
      <Text style={s.body}>{plant.description}</Text>
      <Section title="A little care goes a long way" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {care.map(([icon, label, value]) => (
          <Glass key={label} style={{ width: '48%', flexGrow: 1, padding: 17 }}>
            <View style={{ gap: 9 }}>
              <Icon name={icon} />
              <Text
                style={[s.small, { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }]}
              >
                {label}
              </Text>
              <Text style={{ color: c.text, fontSize: 13, lineHeight: 21 }}>{value}</Text>
            </View>
          </Glass>
        ))}
      </View>
      <Glass style={{ padding: 23, marginTop: 24 }}>
        <View style={{ gap: 12 }}>
          <Eyebrow>YOUR WATERING RHYTHM</Eyebrow>
          <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: c.text }}>
            Every {plant.wateringFrequency}
          </Text>
          <Text style={s.body}>{plant.wateringGuidance}</Text>
          <Text style={[s.small, { color: c.warning }]}>
            This is an estimate. Always check soil moisture first; season, light, and pot size
            change the rhythm.
          </Text>
        </View>
      </Glass>
      <Section title="The everyday rituals" />
      {plant.careTips.map((tip, i) => (
        <View key={tip} style={{ flexDirection: 'row', gap: 15, marginBottom: 18 }}>
          <Text style={{ color: c.accent, fontFamily: fonts.serif, fontSize: 22 }}>0{i + 1}</Text>
          <Text style={[s.body, { flex: 1 }]}>{tip}</Text>
        </View>
      ))}
      <Section title="When your plant needs help" />
      <Text style={[s.body, { marginBottom: 18 }]}>
        Common problems, from high to low concern. For causes and care steps, open Plant Doctor.
      </Text>
      {[
        { severity: 'high', title: 'High Concern', color: c.danger },
        { severity: 'moderate', title: 'Moderate Concern', color: c.warning },
        { severity: 'low', title: 'Low Concern', color: c.accent },
      ].map((group) => {
        const groupIssues = plantIssues.filter((issue) => issue.severity === group.severity);
        if (!groupIssues.length) return null;
        return (
          <View key={group.severity} style={{ gap: 12, marginBottom: 24 }}>
            <Text
              accessibilityRole="header"
              style={[s.body, { color: group.color, fontWeight: '700', fontSize: 16 }]}
            >
              {group.title}
            </Text>
            <Glass style={{ paddingHorizontal: 18 }}>
              {groupIssues.map((issue, index) => (
                <View
                  key={issue.id}
                  style={{
                    paddingVertical: 14,
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderTopColor: c.border,
                  }}
                >
                  <Text style={[s.body, { color: c.text }]}>{issue.name}</Text>
                </View>
              ))}
            </Glass>
          </View>
        );
      })}
      <Button
        label="Check Plant Health"
        icon="medkit-outline"
        onPress={() => router.push({ pathname: '/doctor', params: { plantId: plant.id } })}
      />
      <Sheet
        visible={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Share a little plant wisdom"
      >
        {!!shareError && <Text style={s.body}>{shareError}</Text>}
        <Text style={s.small}>Select and copy this offline care summary to share anywhere.</Text>
        <Text selectable style={s.body}>
          {shareText}
        </Text>
      </Sheet>
    </Screen>
  );
}

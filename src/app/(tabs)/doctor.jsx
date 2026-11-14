import { useTheme } from '../../hooks/useTheme';
import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen, Heading, Eyebrow, Glass, Button, Sheet, Icon, Fade } from '../../components/ui';
import { symptoms, getPlant, issues, getAffectedPlants } from '../../services/plantService';
import { symptomImages, illustrations } from '../../constants/images';
import { fonts } from '../../constants/theme';
export default function Doctor() {
  const { plantId } = useLocalSearchParams();
  return <DoctorFlow key={plantId || 'general'} plantId={plantId} />;
}
function DoctorFlow({ plantId }) {
  const { colors: c, styles: s } = useTheme();
  const plant = getPlant(plantId);
  const [selected, setSelected] = useState(null);
  const matches = selected ? issues.filter((issue) => issue.symptoms.includes(selected.id)) : [];
  return (
    <Screen>
      <Heading
        eyebrow="A GENTLE PATH TO RECOVERY"
        title="Plant Doctor"
        subtitle="Something wrong with your plant? Let’s read the signs together."
      />
      {plant && (
        <Glass style={{ padding: 14, marginBottom: 18 }}>
          <Text style={s.small}>
            Checking on <Text style={{ color: c.accent }}>{plant.name}</Text>. Possible causes still
            need inspection.
          </Text>
        </Glass>
      )}
      <Fade>
        <Glass style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, padding: 20, gap: 8 }}>
              <Eyebrow>LOOK CLOSER</Eyebrow>
              <Text
                style={{ fontFamily: fonts.serif, fontSize: 25, lineHeight: 31, color: c.text }}
              >
                Every leaf{'\n'}tells a story.
              </Text>
              <Text style={s.small}>Tap a symptom to see causes and care tips.</Text>
            </View>
            <Image source={illustrations.doctor} style={{ width: '44%', height: 185 }} />
          </View>
        </Glass>
        <Text style={[s.sectionTitle, { marginBottom: 8 }]}>What are you noticing?</Text>
        <Text style={[s.small, { marginBottom: 18 }]}>
          Tap any symptom for commonly affected plants, causes, and remedies.
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {symptoms.map((sym) => {
            const active = selected?.id === sym.id;
            return (
              <Pressable
                key={sym.id}
                accessibilityRole="button"
                accessibilityLabel={sym.name}
                accessibilityHint="Shows possible causes, affected plants, and care steps"
                onPress={() => setSelected(sym)}
                style={({ pressed }) => ({
                  width: '48%',
                  flexGrow: 1,
                  borderRadius: 19,
                  overflow: 'hidden',
                  borderWidth: active ? 2 : 1,
                  borderColor: active ? c.accent : c.border,
                  backgroundColor: active ? c.raised : c.surface,
                  opacity: pressed ? 0.75 : 1,
                })}
              >
                <Image
                  source={symptomImages[sym.image]}
                  resizeMode="contain"
                  style={{ width: '100%', height: 106, backgroundColor: c.hero }}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 9,
                    right: 9,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? c.accent : c.raised,
                    borderWidth: 1,
                    borderColor: c.border,
                  }}
                >
                  <Icon name="chevron-forward" size={16} color={active ? c.onAccent : c.accent} />
                </View>
                <View style={{ padding: 12, gap: 6 }}>
                  <Text style={{ color: c.text, fontSize: 12, fontWeight: '600', lineHeight: 18 }}>
                    {sym.name}
                  </Text>
                  <Text style={[s.small, { fontSize: 10, lineHeight: 15 }]}>{sym.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Fade>
      <Sheet
        visible={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name || 'Symptom care'}
      >
        {selected && (
          <View key={selected.id} style={{ gap: 18 }}>
            <Image
              source={symptomImages[selected.image]}
              resizeMode="contain"
              style={{ width: '100%', height: 140, borderRadius: 16, backgroundColor: c.hero }}
            />
            <Text style={s.body}>{selected.description}</Text>
            <Text style={s.small}>
              These are possible causes. Check the signs below to find the care that fits your
              plant.
            </Text>
            {matches.map((issue) => (
              <Glass key={issue.id} style={{ padding: 18 }}>
                <View style={{ gap: 14 }}>
                  <Text accessibilityRole="header" style={s.sectionTitle}>
                    {issue.name}
                  </Text>
                  <Text style={s.body}>{issue.why}</Text>
                  <Eyebrow>PLANTS COMMONLY AFFECTED</Eyebrow>
                  <Text style={s.body}>
                    {getAffectedPlants(issue)
                      .map((affected) => affected.name)
                      .join(', ')}
                  </Text>
                  {plant && issue.affectedPlants.includes(plant.id) && (
                    <Text style={[s.small, { color: c.accent }]}>
                      Also associated with {plant.name}
                    </Text>
                  )}
                  <Eyebrow>POSSIBLE CAUSES</Eyebrow>
                  {issue.causes.map((cause) => (
                    <Text key={cause} style={s.body}>
                      {'\u2022 '}
                      {cause}
                    </Text>
                  ))}
                  <Eyebrow>SIGNS TO CHECK</Eyebrow>
                  {issue.identification.map((sign) => (
                    <Text key={sign} style={s.body}>
                      {'\u2022 '}
                      {sign}
                    </Text>
                  ))}
                  <Eyebrow>WHAT TO DO</Eyebrow>
                  {issue.recoverySteps.map((step) => (
                    <Text key={step} style={s.body}>
                      {'\u2022 '}
                      {step}
                    </Text>
                  ))}
                  <Eyebrow>PREVENTION</Eyebrow>
                  {issue.prevention.map((tip) => (
                    <Text key={tip} style={s.body}>
                      {'\u2022 '}
                      {tip}
                    </Text>
                  ))}
                  <Text style={[s.small, { color: c.accent }]}>{issue.recheck}</Text>
                </View>
              </Glass>
            ))}
            {!matches.length && (
              <Text style={s.body}>No care guide is available for this symptom yet.</Text>
            )}
            <Button label="Back to symptoms" secondary onPress={() => setSelected(null)} />
          </View>
        )}
      </Sheet>
    </Screen>
  );
}

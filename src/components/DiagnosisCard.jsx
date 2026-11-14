import { useTheme } from '../hooks/useTheme';
import React, { useState } from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { getAffectedPlants, symptoms } from '../services/plantService';
import { plantImages } from '../constants/images';
import { Glass, Icon, Eyebrow } from './ui';

export function DiagnosisCard({ issue, result, initialOpen = false }) {
  const { colors: c, styles: s } = useTheme();
  const [open, setOpen] = useState(initialOpen),
    affected = getAffectedPlants(issue);
  const severity =
    issue.severity === 'high' ? c.danger : issue.severity === 'moderate' ? c.warning : c.accent;
  return (
    <Glass style={{ marginBottom: 14 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={issue.name}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((v) => !v)}
        style={{ padding: 20, gap: 11 }}
      >
        <View style={s.row}>
          <Text style={{ color: severity, fontSize: 10, fontWeight: '700', letterSpacing: 1.5 }}>
            {issue.severity.toUpperCase()} CONCERN
          </Text>
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} />
        </View>
        <Text style={{ color: c.text, fontSize: 18, fontWeight: '500', lineHeight: 25 }}>
          {issue.name}
        </Text>
        {result && (
          <Text style={s.small}>
            {result.matched.length} matching symptom{result.matched.length === 1 ? '' : 's'}
            {result.supporting.length
              ? ' · ' +
                result.supporting.length +
                ' supporting answer' +
                (result.supporting.length === 1 ? '' : 's')
              : ''}
          </Text>
        )}
        <Text style={s.body}>{issue.why}</Text>
      </Pressable>
      {open && (
        <View style={{ padding: 20, paddingTop: 0, gap: 17 }}>
          <View style={{ height: 1, backgroundColor: c.border }} />
          {result && (
            <>
              <Eyebrow>WHAT MATCHED</Eyebrow>
              <Text style={s.body}>
                {result.matched.map((id) => symptoms.find((s) => s.id === id)?.name).join(' · ')}
              </Text>
              {!!result.supporting.length && (
                <Text style={s.small}>Supporting answers: {result.supporting.join(', ')}.</Text>
              )}
              {!!result.conflicting.length && (
                <Text style={[s.small, { color: c.warning }]}>
                  Some answers do not fit the usual pattern: {result.conflicting.join(', ')}.
                  Inspect before treating.
                </Text>
              )}
            </>
          )}
          <Eyebrow>COMMON CAUSES</Eyebrow>
          {issue.causes.map((x) => (
            <Text key={x} style={s.body}>
              • {x}
            </Text>
          ))}
          <Eyebrow>WHAT TO LOOK FOR</Eyebrow>
          {issue.identification.map((x) => (
            <Text key={x} style={s.body}>
              • {x}
            </Text>
          ))}
          <Eyebrow>THE RECOVERY PLAN</Eyebrow>
          {issue.recoverySteps.map((x, i) => (
            <View key={x} style={{ flexDirection: 'row', gap: 12 }}>
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: c.step,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: c.accent, fontSize: 11 }}>{i + 1}</Text>
              </View>
              <Text style={[s.body, { flex: 1 }]}>{x}</Text>
            </View>
          ))}
          <Eyebrow>KEEP IT FROM COMING BACK</Eyebrow>
          {issue.prevention.map((x) => (
            <Text key={x} style={s.body}>
              • {x}
            </Text>
          ))}
          <View style={{ padding: 15, backgroundColor: c.note, borderRadius: 14, gap: 6 }}>
            <Text style={{ color: c.accent, fontWeight: '600', fontSize: 12 }}>
              When to check again
            </Text>
            <Text style={s.body}>{issue.recheck}</Text>
          </View>
          <Eyebrow>PLANTS COMMONLY AFFECTED</Eyebrow>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {affected.map((p) => (
              <Pressable
                key={p.id}
                accessibilityRole="button"
                accessibilityLabel={'View ' + p.name}
                onPress={() => router.push({ pathname: '/plant/[id]', params: { id: p.id } })}
                style={{ width: 112, gap: 8 }}
              >
                <Image
                  source={plantImages[p.image]}
                  style={{ width: 112, height: 100, borderRadius: 14 }}
                />
                <Text style={[s.small, { color: c.text }]}>{p.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </Glass>
  );
}

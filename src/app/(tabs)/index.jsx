import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Screen,
  Glass,
  Button,
  Icon,
  IconButton,
  Section,
  Eyebrow,
  Sheet,
  Fade,
  s,
} from '../../components/ui';
import { PlantCard } from '../../components/PlantCard';
import { StorageNotice } from '../../components/StorageNotice';
import { plants } from '../../services/plantService';
import { illustrations } from '../../constants/images';
import { colors as c, fonts } from '../../constants/theme';
import { useFavorites } from '../../hooks/useFavorites';
import { usePreferences } from '../../hooks/usePreferences';
import tips from '../../data/careTips.json';
import sources from '../../data/sources.json';
export default function Home() {
  const { ids } = useFavorites(),
    { name, saveName, error, ready } = usePreferences();
  const [panel, setPanel] = useState(null),
    [draft, setDraft] = useState('');
  const { width } = useWindowDimensions(),
    wide = width > 600;
  const hour = new Date().getHours(),
    greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return (
    <Screen>
      <View style={[s.row, { marginBottom: 30 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="leaf" size={25} />
          <Text style={styles.logo}>
            PlantCare<Text style={{ color: c.accent }}>·</Text>
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 9 }}>
          <IconButton
            name="bulb-outline"
            label="Open plant care tips"
            onPress={() => setPanel('tips')}
          />
          <IconButton
            name="person-outline"
            label="Edit profile"
            disabled={!ready}
            onPress={() => {
              setDraft(name);
              setPanel('profile');
            }}
          />
        </View>
      </View>
      <StorageNotice />
      <Text style={[s.body, { fontSize: 13 }]}>
        {greeting}, {name}.
      </Text>
      <Text style={[s.small, { marginTop: 4, marginBottom: 25 }]}>
        Let’s keep your little jungle thriving.
      </Text>
      <Fade>
        <View style={[styles.hero, wide && styles.heroWide]}>
          <View style={[styles.heroArtwork, wide && styles.heroArtworkWide]}>
            <Image
              source={illustrations.plantCollection}
              style={styles.heroImage}
              resizeMode="contain"
              accessibilityLabel="A collection of five lush potted plants"
            />
            <LinearGradient colors={['transparent', '#0c2418']} style={styles.heroImageFade} />
          </View>
          <View style={[styles.heroContent, wide && styles.heroContentWide]}>
            <Eyebrow>GROW A LITTLE JOY</Eyebrow>
            <Text style={[styles.heroTitle, wide && { fontSize: 41, lineHeight: 45 }]}>
              A little green.{'\n'}A better everyday.
            </Text>
            <Text style={[s.body, { maxWidth: 240, color: '#cad8c6' }]}>
              Your plants deserve the best care. Discover, nurture and grow your indoor jungle.
            </Text>
            <View style={{ alignSelf: 'flex-start', marginTop: 20 }}>
              <Button
                label="Explore Plants"
                icon="arrow-forward"
                onPress={() => router.push('/explore')}
              />
            </View>
          </View>
          <View style={styles.heroTag}>
            <View style={styles.dot} />
            <Text style={{ color: c.text, fontSize: 9, letterSpacing: 1.2 }}>
              ROOTED IN WELLBEING
            </Text>
          </View>
        </View>
      </Fade>
      <View style={styles.stats}>
        {[
          [String(plants.length), 'Plant varieties', 'leaf-outline'],
          [String(ids.length), 'Saved plants', 'heart-outline'],
          [String(tips.length), 'Care tips', 'bulb-outline'],
        ].map(([value, label, icon], i) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={() =>
              i === 0 ? router.push('/explore') : i === 1 ? router.push('/saved') : setPanel('tips')
            }
            style={({ pressed }) => [styles.stat, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Icon name={icon} size={18} />
            <Text style={styles.statValue}>{value.padStart(2, '0')}</Text>
            <Text style={{ color: c.sub, fontSize: 10 }}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <Section
        title="Meet your next plant"
        action="View all"
        onPress={() => router.push('/explore')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, paddingBottom: 4 }}
      >
        {[plants[0], plants[1], plants[4], plants[10]].map((p) => (
          <View key={p.id} style={{ width: 195 }}>
            <PlantCard plant={p} />
          </View>
        ))}
      </ScrollView>
      <Section title="Find your kind of green" />
      <View style={s.wrap}>
        {[
          ['Low Light', 'moon-outline', 'low'],
          ['Easy Care', 'sparkles-outline', 'easy'],
          ['Pet Friendly', 'paw-outline', 'pets'],
          ['Air Purifying', 'leaf-outline', 'air'],
        ].map(([label, icon, category]) => (
          <Pressable
            key={category}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/explore', params: { category } })}
            style={({ pressed }) => [styles.category, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Icon name={icon} size={22} />
            <Text style={{ color: c.text, fontSize: 12, fontWeight: '500' }}>{label}</Text>
            <Icon name="arrow-up-right-box-outline" size={16} />
          </Pressable>
        ))}
      </View>
      <Glass style={{ marginTop: 28, padding: 23 }}>
        <View style={s.row}>
          <View style={{ flex: 1, gap: 9 }}>
            <Eyebrow>A LITTLE HELP TO HEAL</Eyebrow>
            <Text style={s.sectionTitle}>Something feels off?</Text>
            <Text style={s.body}>
              Read the signs. Find possible causes and a gentle path to recovery.
            </Text>
          </View>
          <Icon name="medkit-outline" size={36} />
        </View>
        <View style={{ marginTop: 20 }}>
          <Button
            label="Visit Plant Doctor"
            icon="arrow-forward"
            secondary
            onPress={() => router.push('/doctor')}
          />
        </View>
      </Glass>
      <View style={{ alignItems: 'center', paddingTop: 30, gap: 8 }}>
        <Icon name="leaf-outline" size={20} />
        <Text style={styles.footer}>A SLOWER, GREENER EVERYDAY.</Text>
        <Text style={[s.small, { fontSize: 10 }]}>Made to grow with you. Works offline.</Text>
      </View>
      <Sheet
        visible={panel === 'profile'}
        onClose={() => setPanel(null)}
        title="Your little corner"
      >
        <Text style={s.body}>Make yourself at home. Your name stays on this device.</Text>
        <TextInput
          accessibilityLabel="Your name"
          value={draft}
          onChangeText={setDraft}
          maxLength={30}
          placeholder="Plant Lover"
          placeholderTextColor={c.muted}
          style={[s.search, { color: c.text, padding: 16 }]}
        />
        {error && <Text style={{ color: c.danger }}>{error}</Text>}
        <Button
          label="Save name"
          onPress={() => {
            void saveName(draft).then((ok) => {
              if (ok) setPanel(null);
            });
          }}
        />
        <Text style={s.small}>{sources.notes.join('\n\n')}</Text>
        <Eyebrow>CARE LIBRARY SOURCES</Eyebrow>
        {sources.sources.map((source) => (
          <Text key={source.title} selectable style={s.small}>
            {source.title}
            {'\n'}
            {source.url}
          </Text>
        ))}
      </Sheet>
      <Sheet
        visible={panel === 'tips'}
        onClose={() => setPanel(null)}
        title="Small tips, happy plants"
      >
        <Text style={s.body}>
          Your care notes — a few thoughtful habits to return to. These are tips, not scheduled
          notifications.
        </Text>
        {tips.map((t) => (
          <Glass key={t.id} style={{ padding: 20 }}>
            <View style={{ gap: 10 }}>
              <Icon name={t.icon} />
              <Text style={{ color: c.text, fontSize: 16, fontWeight: '500' }}>{t.title}</Text>
              <Text style={s.body}>{t.body}</Text>
            </View>
          </Glass>
        ))}
      </Sheet>
    </Screen>
  );
}
const styles = StyleSheet.create({
  logo: { fontSize: 19, letterSpacing: 4, color: c.text, fontWeight: '700' },
  hero: {
    paddingTop: 48,
    borderRadius: 27,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: '#0c2418',
  },
  heroWide: { minHeight: 435 },
  heroArtwork: { height: 220, marginHorizontal: 16 },
  heroArtworkWide: {
    position: 'absolute',
    width: '46%',
    top: 48,
    bottom: 24,
    right: 8,
    height: 'auto',
    marginHorizontal: 0,
  },
  heroImage: { width: '100%', height: '100%' },
  heroImageFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 24 },
  heroContent: { paddingTop: 12, paddingBottom: 29, paddingHorizontal: 24, gap: 13 },
  heroContentWide: { width: '54%', paddingTop: 30 },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 36,
    color: c.text,
    letterSpacing: -1.3,
  },
  heroTag: {
    position: 'absolute',
    top: 22,
    left: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: c.accent },
  stats: { flexDirection: 'row', gap: 10, marginTop: 16 },
  stat: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(26,53,36,.6)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: c.border,
  },
  statValue: { fontFamily: fonts.serif, fontSize: 26, color: c.text },
  category: {
    width: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 76,
    gap: 9,
    backgroundColor: '#112c1e',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: c.border,
  },
  footer: { color: c.accent2, fontSize: 9, letterSpacing: 2.3 },
});

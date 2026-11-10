import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  Modal,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import { colors as c, fonts } from '../constants/theme';
export function Icon({ name, size = 21, color = c.accent }) {
  return <Ionicons accessible={false} aria-hidden name={name} size={size} color={color} />;
}
export function Fade({ children, style }) {
  const opacity = useSharedValue(0),
    reduced = useReducedMotion();
  useEffect(() => {
    opacity.value = withTiming(1, { duration: reduced ? 0 : 350 });
  }, [opacity, reduced]);
  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}
export function Screen({ children, scroll = true, scrollKey }) {
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [scrollKey]);
  return (
    <View style={s.root}>
      <LinearGradient colors={['#123424', c.bg, c.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {scroll ? (
          <ScrollView
            ref={scrollRef}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={s.page}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={s.page}>{children}</View>
        )}
      </SafeAreaView>
    </View>
  );
}
export function Glass({ children, style }) {
  return (
    <View style={[s.glass, style]}>
      {Platform.OS === 'ios' && (
        <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
      )}
      <View>{children}</View>
    </View>
  );
}
export function Button({ label, onPress, icon, secondary = false, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.4 },
      ]}
    >
      <Text style={[s.buttonText, secondary && { color: c.text }]}>{label}</Text>
      {icon && <Icon name={icon} size={18} color={secondary ? c.accent : c.bg} />}
    </Pressable>
  );
}
export function IconButton({ name, onPress, label, active = false, disabled = false }) {
  const scale = useSharedValue(1),
    reduced = useReducedMotion();
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={animated}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: active, disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          scale.set(withTiming(0.9, { duration: reduced ? 0 : 100 }));
        }}
        onPressOut={() => {
          scale.set(withTiming(1, { duration: reduced ? 0 : 180 }));
        }}
        style={({ pressed }) => [
          s.iconButton,
          active && { backgroundColor: '#31523b' },
          pressed && { opacity: 0.7 },
          disabled && { opacity: 0.4 },
        ]}
      >
        <Icon name={name} color={active ? c.accent : c.text} />
      </Pressable>
    </Animated.View>
  );
}
export function Chip({ label, selected = false, onPress, icon }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [s.chip, selected && s.chipSelected, pressed && { opacity: 0.65 }]}
    >
      {icon && <Icon name={icon} size={15} color={selected ? c.bg : c.accent} />}
      <Text style={[s.chipText, selected && { color: c.bg }]}>{label}</Text>
    </Pressable>
  );
}
export function Eyebrow({ children }) {
  return <Text style={s.eyebrow}>{children}</Text>;
}
export function Heading({ title, subtitle, eyebrow }) {
  return (
    <View style={{ gap: 10, marginBottom: 26 }}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
      {subtitle && <Text style={s.body}>{subtitle}</Text>}
    </View>
  );
}
export function Section({ title, action, onPress }) {
  return (
    <View style={s.section}>
      <Text accessibilityRole="header" style={s.sectionTitle}>
        {title}
      </Text>
      {action && onPress && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={{ minHeight: 44, justifyContent: 'center' }}
        >
          <Text style={s.link}>{action} ↗</Text>
        </Pressable>
      )}
    </View>
  );
}
export function SearchBar({ value, onChange, placeholder = 'Search plants...' }) {
  return (
    <View style={s.search}>
      <Icon name="search-outline" color={c.sub} />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={c.muted}
        style={s.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {!!value && (
        <IconButton name="close-outline" label="Clear search" onPress={() => onChange('')} />
      )}
    </View>
  );
}
export function Sheet({ visible, onClose, title, children }) {
  const { height } = useWindowDimensions();
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.overlay}
      >
        <Pressable
          accessibilityLabel="Close dialog"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View accessibilityViewIsModal style={[s.sheet, { maxHeight: height * 0.9 }]}>
          <View style={s.row}>
            <Text accessibilityRole="header" style={s.sectionTitle}>
              {title}
            </Text>
            <IconButton name="close" label="Close dialog" onPress={onClose} />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 30, gap: 20 }}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export function Empty({ title, body, onPress, label = 'Explore Plants' }) {
  return (
    <Glass style={{ padding: 32, marginTop: 24 }}>
      <View style={{ alignItems: 'center', gap: 18 }}>
        <View style={s.emptyIcon}>
          <Icon name="leaf-outline" size={38} />
        </View>
        <Text style={[s.sectionTitle, { textAlign: 'center' }]}>{title}</Text>
        <Text style={[s.body, { textAlign: 'center' }]}>{body}</Text>
        <Button label={label} onPress={onPress} icon="arrow-forward" />
      </View>
    </Glass>
  );
}
export const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bg },
  page: { padding: 24, paddingBottom: 125, width: '100%', maxWidth: 900, alignSelf: 'center' },
  glass: {
    backgroundColor: 'rgba(27,57,39,.72)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: c.border,
    overflow: 'hidden',
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 38,
    lineHeight: 44,
    color: c.text,
    letterSpacing: -1,
  },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 25, color: c.text, letterSpacing: -0.4 },
  body: { color: c.sub, fontSize: 14, lineHeight: 23 },
  small: { color: c.sub, fontSize: 12, lineHeight: 18 },
  eyebrow: {
    color: c.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  button: {
    minHeight: 50,
    paddingHorizontal: 21,
    paddingVertical: 14,
    borderRadius: 15,
    backgroundColor: c.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: { fontSize: 13, fontWeight: '700', color: c.bg },
  secondary: { backgroundColor: '#203e2c', borderWidth: 1, borderColor: c.border },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(32,61,43,.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.border,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#142f21',
    borderColor: c.border,
    borderWidth: 1,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  chipSelected: { backgroundColor: c.accent, borderColor: c.accent },
  chipText: { color: c.sub, fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 16,
    gap: 8,
  },
  link: { fontSize: 12, color: c.accent, fontWeight: '600' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 16,
    paddingRight: 7,
    minHeight: 56,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: '#102b1e',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: c.text,
    paddingVertical: 16,
    outlineWidth: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: '#10291d',
    padding: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: c.border,
    width: '100%',
    maxWidth: 720,
    gap: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#24432e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: { height: 1, backgroundColor: c.border, marginVertical: 20 },
});

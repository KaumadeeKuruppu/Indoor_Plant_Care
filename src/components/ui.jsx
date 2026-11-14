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
import { useTheme } from '../hooks/useTheme';
export function Icon({ name, size = 21, color }) {
  const { colors: c } = useTheme();
  return (
    <Ionicons accessible={false} aria-hidden name={name} size={size} color={color ?? c.accent} />
  );
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
  const { colors: c, styles: s } = useTheme();
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [scrollKey]);
  return (
    <View style={s.root}>
      <LinearGradient colors={[c.gradient, c.bg, c.bg]} style={StyleSheet.absoluteFill} />
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
  const { styles: s, mode } = useTheme();
  return (
    <View style={[s.glass, style]}>
      {Platform.OS === 'ios' && (
        <BlurView intensity={22} tint={mode} style={StyleSheet.absoluteFill} />
      )}
      <View>{children}</View>
    </View>
  );
}
export function Button({ label, onPress, icon, secondary = false, disabled = false }) {
  const { colors: c, styles: s } = useTheme();
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
      {icon && <Icon name={icon} size={18} color={secondary ? c.accent : c.onAccent} />}
    </Pressable>
  );
}
export function IconButton({ name, onPress, label, active = false, disabled = false }) {
  const { colors: c, styles: s } = useTheme();
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
          active && { backgroundColor: c.iconActive },
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
  const { colors: c, styles: s } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [s.chip, selected && s.chipSelected, pressed && { opacity: 0.65 }]}
    >
      {icon && <Icon name={icon} size={15} color={selected ? c.onAccent : c.accent} />}
      <Text style={[s.chipText, selected && { color: c.onAccent }]}>{label}</Text>
    </Pressable>
  );
}
export function Eyebrow({ children }) {
  const { styles: s } = useTheme();
  return <Text style={s.eyebrow}>{children}</Text>;
}
export function Heading({ title, subtitle, eyebrow }) {
  const { styles: s } = useTheme();
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
  const { styles: s } = useTheme();
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
  const { colors: c, styles: s, mode } = useTheme();
  return (
    <View style={s.search}>
      <Icon name="search-outline" color={c.sub} />
      <TextInput
        keyboardAppearance={mode}
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
  const { styles: s } = useTheme();
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
  const { styles: s } = useTheme();
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

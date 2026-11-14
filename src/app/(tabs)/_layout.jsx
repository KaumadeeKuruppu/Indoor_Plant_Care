import { useTheme } from '../../hooks/useTheme';
import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/ui';

export default function TabLayout() {
  const { colors: c, mode } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.muted,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
        tabBarStyle: {
          position: 'absolute',
          bottom: Math.max(insets.bottom, 16),
          left: 20,
          right: 20,
          marginHorizontal: 20,
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 25,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
        },
        tabBarBackground: () => (
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 25,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.tabBar,
            }}
          >
            {Platform.OS === 'ios' && (
              <BlurView intensity={45} tint={mode} style={StyleSheet.absoluteFill} />
            )}
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" color={typeof color === 'string' ? color : c.accent} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Icon name="compass-outline" color={typeof color === 'string' ? color : c.accent} />
          ),
        }}
      />
      <Tabs.Screen
        name="doctor"
        options={{
          title: 'Plant Doctor',
          tabBarIcon: ({ color }) => (
            <Icon name="medkit-outline" color={typeof color === 'string' ? color : c.accent} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => (
            <Icon name="heart-outline" color={typeof color === 'string' ? color : c.accent} />
          ),
        }}
      />
    </Tabs>
  );
}

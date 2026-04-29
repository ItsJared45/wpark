import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'orange',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 80,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"}  size={focused ? 30 : 28} color={focused ? "orange" : "#999"} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Lots',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "car" : "car-outline"} size= {focused ? 32 : 28} color={focused ? "orange" : "#999"} />,
        }}
      />
    </Tabs>
  );
}

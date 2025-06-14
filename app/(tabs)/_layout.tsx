import { IconSymbol } from '@/components/ui/IconSymbol';
import { Tabs } from 'expo-router';
import React from 'react';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // hide navigation bar
        tabBarStyle: {
          display: 'none',
        },
      }}>
    </Tabs>
  );
}

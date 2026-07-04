import { Tabs } from 'expo-router';

import { BlurTabBarBackground } from '@/components/blur-tab-bar-background';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, NavBar } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarShowLabel: true,
        tabBarBackground: () => <BlurTabBarBackground />,
        tabBarStyle: {
          position: 'absolute',
          left: NavBar.sideMargin,
          right: NavBar.sideMargin + NavBar.fabSize + NavBar.fabGap,
          bottom: NavBar.bottom,
          height: NavBar.height,
          borderRadius: NavBar.height / 2,
          overflow: 'hidden',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          paddingTop: 10,
          paddingBottom: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarItemStyle: {
          borderRadius: 24,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Units',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="square.grid.2x2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="paintpalette.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="chart.bar.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

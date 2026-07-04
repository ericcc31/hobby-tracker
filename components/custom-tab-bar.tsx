import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BlurTabBarBackground } from '@/components/blur-tab-bar-background';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, NavBar } from '@/constants/theme';

// Which "add" screen the Fab opens for each tab. Tabs not listed here (e.g. Progress) hide the Fab.
const ADD_ROUTES: Record<string, string> = {
  index: '/unit/new',
  recipes: '/recipe/new',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const activeRouteName = state.routes[state.index].name;
  const addTarget = ADD_ROUTES[activeRouteName];

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.pill}>
        <BlurTabBarBackground />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const color = isFocused ? Colors.accent : Colors.textSecondary;

          return (
            <Pressable
              key={route.key}
              style={styles.tabItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}>
              {options.tabBarIcon?.({ focused: isFocused, color, size: 24 })}
              <Text style={[styles.label, { color }]}>{options.title ?? route.name}</Text>
            </Pressable>
          );
        })}
      </View>
      {addTarget && (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push(addTarget as never);
          }}>
          <IconSymbol name="plus" size={26} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: NavBar.sideMargin,
    right: NavBar.sideMargin,
    bottom: NavBar.bottom,
    flexDirection: 'row',
    alignItems: 'center',
    gap: NavBar.fabGap,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    height: NavBar.height,
    borderRadius: NavBar.height / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
  fab: {
    width: NavBar.fabSize,
    height: NavBar.fabSize,
    borderRadius: NavBar.fabSize / 2,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.85,
  },
});

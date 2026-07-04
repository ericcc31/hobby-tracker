import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Stage, StageColors, StageLabels, Stages } from '@/constants/theme';
import { getStageCounts } from '@/db/units';

const EMPTY_COUNTS: Record<Stage, number> = {
  bought: 0,
  built: 0,
  primed: 0,
  painted: 0,
  based: 0,
  transfers: 0,
  finished: 0,
};

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [counts, setCounts] = useState<Record<Stage, number>>(EMPTY_COUNTS);

  useFocusEffect(
    useCallback(() => {
      getStageCounts().then(setCounts);
    }, [])
  );

  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);
  const finished = counts.finished;
  const maxCount = Math.max(1, ...Object.values(counts));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: tabBarHeight + 24 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Progress</Text>
        <View style={styles.streakBadge}>
          <IconSymbol name="flame.fill" size={14} color={Colors.textSecondary} />
          <Text style={styles.streakLabel}>0</Text>
        </View>
      </View>

      <View style={styles.statRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>Total units</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{finished}</Text>
          <Text style={styles.statLabel}>Finished</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{total > 0 ? Math.round((finished / total) * 100) : 0}%</Text>
          <Text style={styles.statLabel}>Complete</Text>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        {Stages.map((stage) => (
          <View key={stage} style={styles.barRow}>
            <Text style={styles.barLabel}>{StageLabels[stage]}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: StageColors[stage],
                    width: `${(counts[stage] / maxCount) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.barCount}>{counts[stage]}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  streakLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  chartCard: {
    gap: 12,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    width: 70,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.surface2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  barCount: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
    width: 16,
    textAlign: 'right',
  },
});

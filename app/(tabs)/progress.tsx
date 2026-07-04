import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, StageColors, StageLabels, Stages } from '@/constants/theme';

// Fake counts, one per stage, just to preview the chart shape.
const FAKE_STAGE_COUNTS: Record<string, number> = {
  bought: 2,
  built: 1,
  primed: 1,
  painted: 1,
  based: 0,
  transfers: 0,
  finished: 1,
};

const MAX_COUNT = Math.max(...Object.values(FAKE_STAGE_COUNTS));
const TOTAL = Object.values(FAKE_STAGE_COUNTS).reduce((a, b) => a + b, 0);
const FINISHED = FAKE_STAGE_COUNTS.finished;

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Progress</Text>
        <View style={styles.streakBadge}>
          <IconSymbol name="flame.fill" size={14} color={Colors.accent} />
          <Text style={styles.streakLabel}>3</Text>
        </View>
      </View>

      <View style={styles.statRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{TOTAL}</Text>
          <Text style={styles.statLabel}>Total units</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{FINISHED}</Text>
          <Text style={styles.statLabel}>Finished</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{Math.round((FINISHED / TOTAL) * 100)}%</Text>
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
                    width: `${(FAKE_STAGE_COUNTS[stage] / MAX_COUNT) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.barCount}>{FAKE_STAGE_COUNTS[stage]}</Text>
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

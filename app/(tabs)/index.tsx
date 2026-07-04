import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { Fab } from '@/components/fab';
import { SectionHeader } from '@/components/section-header';
import { StagePill } from '@/components/stage-pill';
import { Colors, Stage, StageLabels, Stages } from '@/constants/theme';

type FakeUnit = {
  id: string;
  name: string;
  chapter: string;
  stage: Stage;
};

const FAKE_UNITS: FakeUnit[] = [
  { id: '1', name: 'Intercessor Squad', chapter: 'Blood Angels', stage: 'painted' },
  { id: '2', name: 'Redemptor Dreadnought', chapter: 'Blood Angels', stage: 'primed' },
  { id: '3', name: 'Assault Intercessors', chapter: 'Blood Angels', stage: 'finished' },
  { id: '4', name: 'Terminator Squad', chapter: 'Dark Angels', stage: 'built' },
  { id: '5', name: 'Ravenwing Bikers', chapter: 'Dark Angels', stage: 'bought' },
];

const SPOTLIGHT_ID = '2';

export default function UnitsScreen() {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<'all' | 'faction'>('all');
  const [stageFilter, setStageFilter] = useState<Stage | null>(null);

  const spotlight = FAKE_UNITS.find((u) => u.id === SPOTLIGHT_ID);

  const filtered = useMemo(
    () => FAKE_UNITS.filter((u) => !stageFilter || u.stage === stageFilter),
    [stageFilter]
  );

  const grouped = useMemo(() => {
    const groups: Record<string, FakeUnit[]> = {};
    for (const unit of filtered) {
      groups[unit.chapter] ??= [];
      groups[unit.chapter].push(unit);
    }
    return groups;
  }, [filtered]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12 }}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Units</Text>
          <View style={styles.segmented}>
            <Pressable
              style={[styles.segment, viewMode === 'all' && styles.segmentActive]}
              onPress={() => setViewMode('all')}>
              <Text style={[styles.segmentLabel, viewMode === 'all' && styles.segmentLabelActive]}>All</Text>
            </Pressable>
            <Pressable
              style={[styles.segment, viewMode === 'faction' && styles.segmentActive]}
              onPress={() => setViewMode('faction')}>
              <Text style={[styles.segmentLabel, viewMode === 'faction' && styles.segmentLabelActive]}>
                Faction
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          <Pressable
            style={[styles.chip, stageFilter === null && styles.chipActive]}
            onPress={() => setStageFilter(null)}>
            <Text style={[styles.chipLabel, stageFilter === null && styles.chipLabelActive]}>All stages</Text>
          </Pressable>
          {Stages.map((stage) => (
            <Pressable
              key={stage}
              style={[styles.chip, stageFilter === stage && styles.chipActive]}
              onPress={() => setStageFilter(stage)}>
              <Text style={[styles.chipLabel, stageFilter === stage && styles.chipLabelActive]}>
                {StageLabels[stage]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {spotlight && (
          <Card style={styles.spotlightCard}>
            <Text style={styles.spotlightLabel}>IN PROGRESS</Text>
            <Text style={styles.spotlightName}>{spotlight.name}</Text>
            <Text style={styles.spotlightChapter}>{spotlight.chapter}</Text>
            <StagePill stage={spotlight.stage} />
          </Card>
        )}

        {viewMode === 'all' ? (
          <>
            <SectionHeader title="All units" subtitle={`${filtered.length}`} />
            <UnitGrid units={filtered} />
          </>
        ) : (
          Object.entries(grouped).map(([chapter, units]) => (
            <View key={chapter}>
              <SectionHeader title={chapter} subtitle={`${units.length}`} />
              <UnitGrid units={units} />
            </View>
          ))
        )}
      </ScrollView>
      <Fab onPress={() => {}} />
    </View>
  );
}

function UnitGrid({ units }: { units: FakeUnit[] }) {
  return (
    <View style={styles.grid}>
      {units.map((unit) => (
        <Card key={unit.id} style={styles.unitCard}>
          <View style={styles.unitThumb} />
          <Text style={styles.unitName} numberOfLines={1}>
            {unit.name}
          </Text>
          <StagePill stage={unit.stage} />
        </Card>
      ))}
    </View>
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
    marginBottom: 12,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: Colors.surface2,
    borderRadius: 10,
    padding: 2,
  },
  segment: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: Colors.accent,
  },
  segmentLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  segmentLabelActive: {
    color: '#fff',
  },
  chipRow: {
    marginBottom: 4,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: Colors.surface2,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Colors.accent,
  },
  chipLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipLabelActive: {
    color: '#fff',
  },
  spotlightCard: {
    marginTop: 16,
    gap: 6,
  },
  spotlightLabel: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  spotlightName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  spotlightChapter: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  unitCard: {
    width: '47%',
    gap: 8,
  },
  unitThumb: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: Colors.surface2,
  },
  unitName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});

import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { Fab } from '@/components/fab';
import { SectionHeader } from '@/components/section-header';
import { StagePill } from '@/components/stage-pill';
import { Colors, Stage, StageLabels, Stages } from '@/constants/theme';
import { listUnits, Unit } from '@/db/units';

export default function UnitsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [units, setUnits] = useState<Unit[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'faction'>('all');
  const [stageFilter, setStageFilter] = useState<Stage | null>(null);

  useFocusEffect(
    useCallback(() => {
      listUnits().then(setUnits);
    }, [])
  );

  const spotlight = units.find((u) => u.inProgress);

  const filtered = useMemo(
    () => units.filter((u) => !stageFilter || u.stage === stageFilter),
    [units, stageFilter]
  );

  const grouped = useMemo(() => {
    const groups: Record<string, Unit[]> = {};
    for (const unit of filtered) {
      const key = unit.chapter ?? unit.army ?? 'Unassigned';
      groups[key] ??= [];
      groups[key].push(unit);
    }
    return groups;
  }, [filtered]);

  function openUnit(id: number) {
    router.push({ pathname: '/unit/[id]', params: { id: String(id) } });
  }

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

        {units.length > 0 && (
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
        )}

        {spotlight && (
          <Card style={styles.spotlightCard}>
            <Text style={styles.spotlightLabel}>IN PROGRESS</Text>
            <Text style={styles.spotlightName}>{spotlight.name}</Text>
            <Text style={styles.spotlightChapter}>{spotlight.chapter ?? spotlight.army}</Text>
            <StagePill stage={spotlight.stage} />
          </Card>
        )}

        {units.length === 0 ? (
          <EmptyState icon="square.grid.2x2.fill" message="No units yet. Tap + to add your first miniature." />
        ) : viewMode === 'all' ? (
          <>
            <SectionHeader title="All units" subtitle={`${filtered.length}`} />
            <UnitGrid units={filtered} onPress={openUnit} />
          </>
        ) : (
          Object.entries(grouped).map(([chapter, chapterUnits]) => (
            <View key={chapter}>
              <SectionHeader title={chapter} subtitle={`${chapterUnits.length}`} />
              <UnitGrid units={chapterUnits} onPress={openUnit} />
            </View>
          ))
        )}
      </ScrollView>
      <Fab onPress={() => router.push('/unit/new')} />
    </View>
  );
}

function UnitGrid({ units, onPress }: { units: Unit[]; onPress: (id: number) => void }) {
  return (
    <View style={styles.grid}>
      {units.map((unit) => (
        <Pressable key={unit.id} onPress={() => onPress(unit.id)} style={styles.unitCardWrapper}>
          <Card style={styles.unitCard}>
            <View style={styles.unitThumb} />
            <Text style={styles.unitName} numberOfLines={1}>
              {unit.name}
            </Text>
            <StagePill stage={unit.stage} />
          </Card>
        </Pressable>
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
  unitCardWrapper: {
    width: '47%',
  },
  unitCard: {
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

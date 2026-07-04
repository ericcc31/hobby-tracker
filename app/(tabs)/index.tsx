import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { PickerModal } from '@/components/picker-modal';
import { ReorderModal } from '@/components/reorder-modal';
import { SectionHeader } from '@/components/section-header';
import { StagePill } from '@/components/stage-pill';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getAllegiance } from '@/constants/factions';
import { Colors, SCREEN_BOTTOM_PADDING, Stage, StageLabels, Stages } from '@/constants/theme';
import { getUnitThumbnails } from '@/db/photos';
import { getAllegianceOrder, setAllegianceOrder } from '@/db/settings';
import { deleteUnit, listUnits, Unit } from '@/db/units';

const ALL_STAGES_LABEL = 'All stages';
const STAGE_FILTER_SECTIONS = [{ title: 'Filter by Stage', items: [ALL_STAGES_LABEL, ...Stages.map((s) => StageLabels[s])] }];
const DEFAULT_ALLEGIANCE_ORDER = ['Space Marines', 'Imperium', 'Chaos', 'Xenos', 'Unassigned'];

export default function UnitsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [units, setUnits] = useState<Unit[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});
  const [stageFilter, setStageFilter] = useState<Stage | null>(null);
  const [filterPickerVisible, setFilterPickerVisible] = useState(false);
  const [allegianceOrder, setAllegianceOrderState] = useState<string[]>(DEFAULT_ALLEGIANCE_ORDER);
  const [reorderVisible, setReorderVisible] = useState(false);

  const refresh = useCallback(() => {
    listUnits().then(setUnits);
    getUnitThumbnails().then(setThumbnails);
    getAllegianceOrder(DEFAULT_ALLEGIANCE_ORDER).then(setAllegianceOrderState);
  }, []);

  useFocusEffect(refresh);

  function handleLongPress(unit: Unit) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(unit.name, undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await deleteUnit(unit.id);
          refresh();
        },
      },
    ]);
  }

  const spotlight = units.find((u) => u.inProgress);

  const filtered = useMemo(
    () => units.filter((u) => !stageFilter || u.stage === stageFilter),
    [units, stageFilter]
  );

  const grouped = useMemo(() => {
    const groups: Record<string, Record<string, Unit[]>> = {};
    for (const unit of filtered) {
      const allegiance = getAllegiance(unit.army);
      const subgroup = unit.chapter ?? unit.army ?? 'Unassigned';
      groups[allegiance] ??= {};
      groups[allegiance][subgroup] ??= [];
      groups[allegiance][subgroup].push(unit);
    }
    return groups;
  }, [filtered]);

  const orderedAllegiances = useMemo(() => {
    const present = Object.keys(grouped);
    const ordered = allegianceOrder.filter((a) => present.includes(a));
    const missing = present.filter((a) => !allegianceOrder.includes(a));
    return [...ordered, ...missing];
  }, [grouped, allegianceOrder]);

  function openUnit(id: number) {
    router.push({ pathname: '/unit/[id]', params: { id: String(id) } });
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: SCREEN_BOTTOM_PADDING }}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Units</Text>
          <View style={styles.headerActions}>
            {orderedAllegiances.length > 1 && (
              <Pressable style={styles.iconButton} onPress={() => setReorderVisible(true)}>
                <IconSymbol name="arrow.up.arrow.down" size={16} color={Colors.textSecondary} />
              </Pressable>
            )}
            {units.length > 0 && (
              <Pressable style={styles.filterButton} onPress={() => setFilterPickerVisible(true)}>
                <Text style={styles.filterButtonLabel}>{stageFilter ? StageLabels[stageFilter] : ALL_STAGES_LABEL}</Text>
                <Text style={styles.filterButtonCaret}>▾</Text>
              </Pressable>
            )}
          </View>
        </View>
        <PickerModal
          visible={filterPickerVisible}
          title="Filter by Stage"
          sections={STAGE_FILTER_SECTIONS}
          onClose={() => setFilterPickerVisible(false)}
          onSelect={(value) => {
            if (value === ALL_STAGES_LABEL) {
              setStageFilter(null);
            } else {
              const match = Stages.find((s) => StageLabels[s] === value);
              setStageFilter(match ?? null);
            }
            setFilterPickerVisible(false);
          }}
        />
        <ReorderModal
          visible={reorderVisible}
          title="Reorder Factions"
          items={orderedAllegiances}
          onClose={() => setReorderVisible(false)}
          onSave={(order) => {
            const fullOrder = [...order, ...DEFAULT_ALLEGIANCE_ORDER.filter((a) => !order.includes(a))];
            setAllegianceOrderState(fullOrder);
            setAllegianceOrder(fullOrder);
          }}
        />

        {spotlight && (
          <Card style={styles.spotlightCard}>
            {thumbnails[spotlight.id] ? (
              <Image source={{ uri: thumbnails[spotlight.id] }} style={styles.spotlightThumb} contentFit="cover" />
            ) : (
              <View style={styles.spotlightThumb} />
            )}
            <View style={styles.spotlightInfo}>
              <Text style={styles.spotlightLabel}>IN PROGRESS</Text>
              <Text style={styles.spotlightName}>{spotlight.name}</Text>
              <Text style={styles.spotlightChapter}>{spotlight.chapter ?? spotlight.army}</Text>
              <StagePill stage={spotlight.stage} />
            </View>
          </Card>
        )}

        {units.length === 0 ? (
          <EmptyState icon="square.grid.2x2.fill" message="No units yet. Tap + to add your first miniature." />
        ) : (
          orderedAllegiances.map((allegiance) => {
            const subgroups = grouped[allegiance];
            const allegianceTotal = Object.values(subgroups).reduce((sum, u) => sum + u.length, 0);
            return (
              <View key={allegiance}>
                <SectionHeader title={allegiance} subtitle={`${allegianceTotal}`} level="primary" />
                {Object.entries(subgroups).map(([subgroup, subgroupUnits]) => (
                  <View key={subgroup}>
                    <SectionHeader title={subgroup} subtitle={`${subgroupUnits.length}`} level="secondary" />
                    <UnitGrid units={subgroupUnits} thumbnails={thumbnails} onPress={openUnit} onLongPress={handleLongPress} />
                  </View>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function UnitGrid({
  units,
  thumbnails,
  onPress,
  onLongPress,
}: {
  units: Unit[];
  thumbnails: Record<number, string>;
  onPress: (id: number) => void;
  onLongPress: (unit: Unit) => void;
}) {
  return (
    <View style={styles.grid}>
      {units.map((unit) => (
        <Pressable
          key={unit.id}
          onPress={() => onPress(unit.id)}
          onLongPress={() => onLongPress(unit)}
          style={styles.unitCardWrapper}>
          <Card style={styles.unitCard}>
            {thumbnails[unit.id] ? (
              <Image source={{ uri: thumbnails[unit.id] }} style={styles.unitThumb} contentFit="cover" />
            ) : (
              <View style={styles.unitThumb} />
            )}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface2,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  filterButtonLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  filterButtonCaret: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  spotlightCard: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  spotlightThumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: Colors.surface2,
  },
  spotlightInfo: {
    flex: 1,
    gap: 4,
  },
  spotlightLabel: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  spotlightName: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  spotlightChapter: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 2,
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

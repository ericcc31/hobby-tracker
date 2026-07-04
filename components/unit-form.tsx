import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PickerModal } from '@/components/picker-modal';
import { StagePill } from '@/components/stage-pill';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FACTIONS, isSpaceMarines, SPACE_MARINE_CHAPTERS } from '@/constants/factions';
import { Colors, Stage, Stages } from '@/constants/theme';
import { listRecipes, Recipe } from '@/db/recipes';
import { Unit, UnitInput } from '@/db/units';

const FACTION_SECTIONS = Object.entries(FACTIONS).map(([allegiance, items]) => ({
  title: allegiance,
  items,
}));

export function UnitForm({
  initialValues,
  initialPinnedRecipeIds = [],
  initialInProgress = false,
  photosSection,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  initialValues?: Unit;
  initialPinnedRecipeIds?: number[];
  initialInProgress?: boolean;
  photosSection?: React.ReactNode;
  submitLabel: string;
  onSubmit: (input: UnitInput, pinnedRecipeIds: number[], inProgress: boolean) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [army, setArmy] = useState(initialValues?.army ?? '');
  const [chapter, setChapter] = useState<string | null>(initialValues?.chapter ?? null);
  const [stage, setStage] = useState<Stage>(initialValues?.stage ?? 'bought');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [inProgress, setInProgress] = useState(initialInProgress);
  const [pinnedRecipeIds, setPinnedRecipeIds] = useState<number[]>(initialPinnedRecipeIds);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [saving, setSaving] = useState(false);
  const [factionPickerVisible, setFactionPickerVisible] = useState(false);

  useEffect(() => {
    listRecipes().then(setAllRecipes);
  }, []);

  const showChapterPicker = isSpaceMarines(army);

  function toggleRecipe(id: number) {
    setPinnedRecipeIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  }

  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give this unit a name before saving.');
      return;
    }
    setSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await onSubmit(
      {
        name: name.trim(),
        army: army.trim(),
        chapter: showChapterPicker ? chapter : null,
        stage,
        notes,
      },
      pinnedRecipeIds,
      inProgress
    );
    setSaving(false);
  }

  function handleDelete() {
    Alert.alert('Delete unit?', `"${name}" and its photos will be permanently deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await onDelete?.();
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Intercessor Squad"
        placeholderTextColor={Colors.textSecondary}
      />

      {photosSection ?? (
        <View style={styles.photosHint}>
          <Text style={styles.photosHintLabel}>Save this unit to start adding stage photos.</Text>
        </View>
      )}

      <Text style={styles.label}>Army</Text>
      <Pressable style={styles.input} onPress={() => setFactionPickerVisible(true)}>
        <Text style={army ? styles.inputValue : styles.inputPlaceholder}>{army || 'Choose an army'}</Text>
      </Pressable>
      <PickerModal
        visible={factionPickerVisible}
        title="Choose Army"
        sections={FACTION_SECTIONS}
        searchable
        allowCustom
        onClose={() => setFactionPickerVisible(false)}
        onSelect={(value) => {
          setArmy(value);
          if (!isSpaceMarines(value)) setChapter(null);
          setFactionPickerVisible(false);
        }}
      />

      {showChapterPicker && (
        <>
          <Text style={styles.label}>Chapter</Text>
          <View style={styles.wrapRow}>
            {SPACE_MARINE_CHAPTERS.map((c) => (
              <Pressable
                key={c}
                style={[styles.optionChip, chapter === c && styles.optionChipActive]}
                onPress={() => setChapter(c)}>
                <Text style={[styles.optionChipLabel, chapter === c && styles.optionChipLabelActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      <Text style={styles.label}>Stage</Text>
      <View style={styles.wrapRow}>
        {Stages.map((s) => (
          <Pressable key={s} onPress={() => setStage(s)} style={stage === s ? styles.stageSelected : undefined}>
            <StagePill stage={s} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.inProgressRow} onPress={() => setInProgress((v) => !v)}>
        <IconSymbol
          name="flame.fill"
          size={18}
          color={inProgress ? Colors.accent : Colors.textSecondary}
        />
        <Text style={[styles.inProgressLabel, inProgress && { color: Colors.text }]}>
          Pin as in-progress spotlight
        </Text>
      </Pressable>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Paint schemes, conversion plans, anything..."
        placeholderTextColor={Colors.textSecondary}
        multiline
      />

      {allRecipes.length > 0 && (
        <>
          <Text style={styles.label}>Pinned recipes</Text>
          <View style={styles.wrapRow}>
            {allRecipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                style={[styles.optionChip, pinnedRecipeIds.includes(recipe.id) && styles.optionChipActive]}
                onPress={() => toggleRecipe(recipe.id)}>
                <Text
                  style={[
                    styles.optionChipLabel,
                    pinnedRecipeIds.includes(recipe.id) && styles.optionChipLabelActive,
                  ]}>
                  {recipe.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      <Pressable style={styles.saveButton} onPress={handleSubmit} disabled={saving}>
        <Text style={styles.saveButtonLabel}>{saving ? 'Saving...' : submitLabel}</Text>
      </Pressable>

      {onDelete && (
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonLabel}>Delete Unit</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
    gap: 4,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    color: Colors.text,
    fontSize: 15,
  },
  notesInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  inputValue: {
    color: Colors.text,
    fontSize: 15,
  },
  inputPlaceholder: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  photosHint: {
    marginTop: 18,
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  photosHintLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stageSelected: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.text,
  },
  optionChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface2,
  },
  optionChipActive: {
    backgroundColor: Colors.accent,
  },
  optionChipLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  optionChipLabelActive: {
    color: '#fff',
  },
  inProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  inProgressLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 28,
  },
  saveButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  deleteButtonLabel: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
});

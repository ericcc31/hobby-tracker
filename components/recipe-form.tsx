import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { listUnits, Unit } from '@/db/units';
import { Recipe, RecipeInput, RecipeStep } from '@/db/recipes';

export function RecipeForm({
  initialValues,
  initialPinnedUnitIds = [],
  submitLabel,
  onSubmit,
  onDelete,
}: {
  initialValues?: Recipe;
  initialPinnedUnitIds?: number[];
  submitLabel: string;
  onSubmit: (input: RecipeInput, pinnedUnitIds: number[]) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [steps, setSteps] = useState<RecipeStep[]>(
    initialValues?.steps.length ? initialValues.steps : [{ paintName: '', technique: '' }]
  );
  const [pinnedUnitIds, setPinnedUnitIds] = useState<number[]>(initialPinnedUnitIds);
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listUnits().then(setAllUnits);
  }, []);

  function updateStep(index: number, field: keyof RecipeStep, value: string) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function addStep() {
    setSteps((prev) => [...prev, { paintName: '', technique: '' }]);
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function moveStep(index: number, direction: -1 | 1) {
    setSteps((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function toggleUnit(id: number) {
    setPinnedUnitIds((prev) => (prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]));
  }

  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give this recipe a name before saving.');
      return;
    }
    const cleanSteps = steps
      .map((s) => ({ paintName: s.paintName.trim(), technique: s.technique.trim() }))
      .filter((s) => s.paintName.length > 0);
    setSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await onSubmit({ name: name.trim(), steps: cleanSteps }, pinnedUnitIds);
    setSaving(false);
  }

  function handleDelete() {
    Alert.alert('Delete recipe?', `"${name}" will be permanently deleted.`, [
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
        placeholder="e.g. Blood Angels Red Armor"
        placeholderTextColor={Colors.textSecondary}
      />

      <Text style={styles.label}>Steps</Text>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepRow}>
          <View style={styles.stepFields}>
            <TextInput
              style={styles.input}
              value={step.paintName}
              onChangeText={(v) => updateStep(index, 'paintName', v)}
              placeholder="Paint name"
              placeholderTextColor={Colors.textSecondary}
            />
            <TextInput
              style={[styles.input, styles.techniqueInput]}
              value={step.technique}
              onChangeText={(v) => updateStep(index, 'technique', v)}
              placeholder="Technique / notes"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          <View style={styles.stepActions}>
            <Pressable onPress={() => moveStep(index, -1)} style={styles.stepActionBtn}>
              <IconSymbol name="chevron.up" size={16} color={Colors.textSecondary} />
            </Pressable>
            <Pressable onPress={() => moveStep(index, 1)} style={styles.stepActionBtn}>
              <IconSymbol name="chevron.down" size={16} color={Colors.textSecondary} />
            </Pressable>
            <Pressable onPress={() => removeStep(index)} style={styles.stepActionBtn}>
              <Text style={styles.removeStepLabel}>✕</Text>
            </Pressable>
          </View>
        </View>
      ))}
      <Pressable style={styles.addStepButton} onPress={addStep}>
        <Text style={styles.addStepLabel}>+ Add step</Text>
      </Pressable>

      {allUnits.length > 0 && (
        <>
          <Text style={styles.label}>Pinned units</Text>
          <View style={styles.wrapRow}>
            {allUnits.map((unit) => (
              <Pressable
                key={unit.id}
                style={[styles.optionChip, pinnedUnitIds.includes(unit.id) && styles.optionChipActive]}
                onPress={() => toggleUnit(unit.id)}>
                <Text
                  style={[styles.optionChipLabel, pinnedUnitIds.includes(unit.id) && styles.optionChipLabelActive]}>
                  {unit.name}
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
          <Text style={styles.deleteButtonLabel}>Delete Recipe</Text>
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
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  stepFields: {
    flex: 1,
    gap: 8,
  },
  techniqueInput: {
    fontSize: 13,
  },
  stepActions: {
    gap: 4,
  },
  stepActionBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeStepLabel: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  addStepButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  addStepLabel: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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

import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { ActionSheetIOS, Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Stage, StageLabels, Stages } from '@/constants/theme';
import { askSource, pickImage } from '@/lib/image-picker-helpers';

export function StagePhotoManager({
  photos,
  onAdd,
  onRemove,
}: {
  photos: Partial<Record<Stage, string>>;
  onAdd: (stage: Stage, uri: string) => void | Promise<void>;
  onRemove: (stage: Stage) => void | Promise<void>;
}) {
  const emptyStages = Stages.filter((s) => !photos[s]);

  async function handleAddPress() {
    if (emptyStages.length === 0) {
      Alert.alert('All stages have photos', 'Tap an existing photo below to replace or remove it.');
      return;
    }
    const source = await askSource();
    if (!source) return;
    const uri = await pickImage(source);
    if (!uri) return;

    if (emptyStages.length === 1) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await onAdd(emptyStages[0], uri);
      return;
    }

    const labels = emptyStages.map((s) => StageLabels[s]);
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { title: 'Which stage is this for?', options: [...labels, 'Cancel'], cancelButtonIndex: labels.length },
        async (index) => {
          if (index < emptyStages.length) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await onAdd(emptyStages[index], uri);
          }
        }
      );
    } else {
      Alert.alert('Which stage is this for?', undefined, [
        ...emptyStages.map((s) => ({
          text: StageLabels[s],
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await onAdd(s, uri);
          },
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ]);
    }
  }

  async function handleReplace(stage: Stage) {
    const source = await askSource();
    if (!source) return;
    const uri = await pickImage(source);
    if (uri) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await onAdd(stage, uri);
    }
  }

  function handleExistingPress(stage: Stage) {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: StageLabels[stage],
          options: ['Replace Photo', 'Remove Photo', 'Cancel'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        (index) => {
          if (index === 0) handleReplace(stage);
          else if (index === 1) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            onRemove(stage);
          }
        }
      );
    } else {
      Alert.alert(StageLabels[stage], undefined, [
        { text: 'Replace Photo', onPress: () => handleReplace(stage) },
        {
          text: 'Remove Photo',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            onRemove(stage);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  }

  const filledStages = Stages.filter((s) => photos[s]);

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Photos by Stage</Text>
        <Pressable style={styles.addButton} onPress={handleAddPress}>
          <IconSymbol name="plus" size={13} color="#fff" />
          <Text style={styles.addButtonLabel}>Add Photo</Text>
        </Pressable>
      </View>
      {filledStages.length === 0 ? (
        <Text style={styles.emptyLabel}>No photos yet.</Text>
      ) : (
        <View style={styles.grid}>
          {filledStages.map((stage) => (
            <Pressable key={stage} style={styles.slotWrapper} onPress={() => handleExistingPress(stage)}>
              <Image source={{ uri: photos[stage] }} style={styles.thumb} contentFit="cover" />
              <Text style={styles.slotLabel} numberOfLines={1}>
                {StageLabels[stage]}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotWrapper: {
    width: '30%',
    alignItems: 'center',
    gap: 4,
  },
  thumb: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: Colors.surface2,
  },
  slotLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  emptyLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
  },
});

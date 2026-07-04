import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';
import { ActionSheetIOS, Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Stage, StageLabels, Stages } from '@/constants/theme';
import { deleteStagePhoto, getStagePhotos, setStagePhoto, StagePhoto } from '@/db/photos';
import { deletePhotoFile, saveUnitStagePhoto } from '@/lib/photo-storage';

export function UnitPhotos({ unitId }: { unitId: number }) {
  const [photos, setPhotos] = useState<Record<Stage, StagePhoto | null> | null>(null);

  const refresh = useCallback(() => {
    getStagePhotos(unitId).then(setPhotos);
  }, [unitId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function pickFrom(stage: Stage, source: 'camera' | 'library') {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        `Enable ${source === 'camera' ? 'camera' : 'photo library'} access in Settings to add photos.`
      );
      return;
    }
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true, aspect: [1, 1] })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true, aspect: [1, 1] });
    if (result.canceled) return;

    const savedUri = await saveUnitStagePhoto(unitId, stage, result.assets[0].uri);
    await setStagePhoto(unitId, stage, savedUri);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    refresh();
  }

  async function removePhoto(stage: Stage) {
    const uri = await deleteStagePhoto(unitId, stage);
    if (uri) await deletePhotoFile(uri);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    refresh();
  }

  function handlePress(stage: Stage) {
    const hasPhoto = !!photos?.[stage];

    if (Platform.OS === 'ios') {
      const options = hasPhoto
        ? ['Take Photo', 'Choose from Library', 'Remove Photo', 'Cancel']
        : ['Take Photo', 'Choose from Library', 'Cancel'];
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: StageLabels[stage],
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: hasPhoto ? 2 : undefined,
        },
        (index) => {
          if (index === 0) pickFrom(stage, 'camera');
          else if (index === 1) pickFrom(stage, 'library');
          else if (hasPhoto && index === 2) removePhoto(stage);
        }
      );
    } else {
      Alert.alert(StageLabels[stage], undefined, [
        { text: 'Take Photo', onPress: () => pickFrom(stage, 'camera') },
        { text: 'Choose from Library', onPress: () => pickFrom(stage, 'library') },
        ...(hasPhoto ? [{ text: 'Remove Photo', style: 'destructive' as const, onPress: () => removePhoto(stage) }] : []),
        { text: 'Cancel', style: 'cancel' as const },
      ]);
    }
  }

  return (
    <View>
      <Text style={styles.label}>Photos by Stage</Text>
      <View style={styles.grid}>
        {Stages.map((stage) => {
          const photo = photos?.[stage];
          return (
            <Pressable key={stage} style={styles.slotWrapper} onPress={() => handlePress(stage)}>
              {photo ? (
                <Image source={{ uri: photo.uri }} style={styles.thumb} contentFit="cover" />
              ) : (
                <View style={styles.emptySlot}>
                  <IconSymbol name="plus" size={18} color={Colors.textSecondary} />
                </View>
              )}
              <Text style={styles.slotLabel} numberOfLines={1}>
                {StageLabels[stage]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
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
  emptySlot: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
});

import * as FileSystem from 'expo-file-system/legacy';

import { Stage } from '@/constants/theme';

const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/units/`;

export async function saveUnitStagePhoto(unitId: number, stage: Stage, pickedUri: string): Promise<string> {
  const dir = `${PHOTOS_DIR}${unitId}/`;
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }

  const destUri = `${dir}${stage}.jpg`;
  const existing = await FileSystem.getInfoAsync(destUri);
  if (existing.exists) {
    await FileSystem.deleteAsync(destUri, { idempotent: true });
  }
  await FileSystem.copyAsync({ from: pickedUri, to: destUri });
  return destUri;
}

export async function deletePhotoFile(uri: string): Promise<void> {
  await FileSystem.deleteAsync(uri, { idempotent: true });
}

export async function deleteAllUnitPhotos(unitId: number): Promise<void> {
  await FileSystem.deleteAsync(`${PHOTOS_DIR}${unitId}/`, { idempotent: true });
}

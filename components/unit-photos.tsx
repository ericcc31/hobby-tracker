import { useCallback, useEffect, useState } from 'react';

import { StagePhotoManager } from '@/components/stage-photo-manager';
import { Stage, Stages } from '@/constants/theme';
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

  const displayPhotos: Partial<Record<Stage, string>> = {};
  if (photos) {
    for (const stage of Stages) {
      const entry = photos[stage];
      if (entry) displayPhotos[stage] = entry.uri;
    }
  }

  async function handleAdd(stage: Stage, rawUri: string) {
    const savedUri = await saveUnitStagePhoto(unitId, stage, rawUri);
    await setStagePhoto(unitId, stage, savedUri);
    refresh();
  }

  async function handleRemove(stage: Stage) {
    const uri = await deleteStagePhoto(unitId, stage);
    if (uri) await deletePhotoFile(uri);
    refresh();
  }

  return <StagePhotoManager photos={displayPhotos} onAdd={handleAdd} onRemove={handleRemove} />;
}

import { Stage, Stages } from '@/constants/theme';
import { getDb } from './database';

export type StagePhoto = {
  stage: Stage;
  uri: string;
  takenAt: number;
};

type PhotoRow = {
  stage: string;
  photo_uri: string;
  taken_at: number;
};

export async function getStagePhotos(unitId: number): Promise<Record<Stage, StagePhoto | null>> {
  const db = await getDb();
  const rows = await db.getAllAsync<PhotoRow>(
    'SELECT stage, photo_uri, taken_at FROM unit_stage_photos WHERE unit_id = ?',
    unitId
  );
  const result = {} as Record<Stage, StagePhoto | null>;
  for (const stage of Stages) result[stage] = null;
  for (const row of rows) {
    // Cache-bust the display URI so an updated photo doesn't show a stale cached image.
    result[row.stage as Stage] = { stage: row.stage as Stage, uri: `${row.photo_uri}?t=${row.taken_at}`, takenAt: row.taken_at };
  }
  return result;
}

export async function setStagePhoto(unitId: number, stage: Stage, photoUri: string): Promise<void> {
  const db = await getDb();
  const now = Date.now();
  await db.runAsync(
    `INSERT INTO unit_stage_photos (unit_id, stage, photo_uri, taken_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(unit_id, stage) DO UPDATE SET photo_uri = excluded.photo_uri, taken_at = excluded.taken_at`,
    unitId,
    stage,
    photoUri,
    now
  );
}

export async function deleteStagePhoto(unitId: number, stage: Stage): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<PhotoRow>(
    'SELECT photo_uri FROM unit_stage_photos WHERE unit_id = ? AND stage = ?',
    unitId,
    stage
  );
  await db.runAsync('DELETE FROM unit_stage_photos WHERE unit_id = ? AND stage = ?', unitId, stage);
  return row?.photo_uri ?? null;
}

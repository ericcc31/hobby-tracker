import { Stage } from '@/constants/theme';
import { deleteAllUnitPhotos } from '@/lib/photo-storage';
import { getDb } from './database';

export type Unit = {
  id: number;
  name: string;
  army: string;
  chapter: string | null;
  stage: Stage;
  notes: string;
  inProgress: boolean;
  createdAt: number;
  updatedAt: number;
};

export type UnitInput = {
  name: string;
  army: string;
  chapter: string | null;
  stage: Stage;
  notes: string;
};

type UnitRow = {
  id: number;
  name: string;
  army: string;
  chapter: string | null;
  stage: string;
  notes: string;
  in_progress: number;
  created_at: number;
  updated_at: number;
};

function rowToUnit(row: UnitRow): Unit {
  return {
    id: row.id,
    name: row.name,
    army: row.army,
    chapter: row.chapter,
    stage: row.stage as Stage,
    notes: row.notes,
    inProgress: row.in_progress === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listUnits(): Promise<Unit[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<UnitRow>('SELECT * FROM units ORDER BY updated_at DESC');
  return rows.map(rowToUnit);
}

export async function getUnit(id: number): Promise<Unit | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<UnitRow>('SELECT * FROM units WHERE id = ?', id);
  return row ? rowToUnit(row) : null;
}

export async function createUnit(input: UnitInput): Promise<number> {
  const db = await getDb();
  const now = Date.now();
  const result = await db.runAsync(
    'INSERT INTO units (name, army, chapter, stage, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    input.name,
    input.army,
    input.chapter,
    input.stage,
    input.notes,
    now,
    now
  );
  return result.lastInsertRowId;
}

export async function updateUnit(id: number, input: UnitInput): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE units SET name = ?, army = ?, chapter = ?, stage = ?, notes = ?, updated_at = ? WHERE id = ?',
    input.name,
    input.army,
    input.chapter,
    input.stage,
    input.notes,
    Date.now(),
    id
  );
}

export async function deleteUnit(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM units WHERE id = ?', id);
  await deleteAllUnitPhotos(id);
}

export async function setInProgress(id: number, inProgress: boolean): Promise<void> {
  const db = await getDb();
  if (inProgress) {
    await db.runAsync('UPDATE units SET in_progress = 0');
  }
  await db.runAsync('UPDATE units SET in_progress = ? WHERE id = ?', inProgress ? 1 : 0, id);
}

export async function getPinnedRecipeIds(unitId: number): Promise<number[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ recipe_id: number }>(
    'SELECT recipe_id FROM unit_recipe_pins WHERE unit_id = ?',
    unitId
  );
  return rows.map((r) => r.recipe_id);
}

export async function setPinnedRecipes(unitId: number, recipeIds: number[]): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM unit_recipe_pins WHERE unit_id = ?', unitId);
  for (const recipeId of recipeIds) {
    await db.runAsync('INSERT INTO unit_recipe_pins (unit_id, recipe_id) VALUES (?, ?)', unitId, recipeId);
  }
}

export async function getStageCounts(): Promise<Record<Stage, number>> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ stage: string; count: number }>(
    'SELECT stage, COUNT(*) as count FROM units GROUP BY stage'
  );
  const counts = {
    bought: 0,
    built: 0,
    primed: 0,
    painted: 0,
    based: 0,
    transfers: 0,
    finished: 0,
  } as Record<Stage, number>;
  for (const row of rows) {
    counts[row.stage as Stage] = row.count;
  }
  return counts;
}

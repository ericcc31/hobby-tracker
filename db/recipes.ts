import { deletePhotoFile } from '@/lib/photo-storage';
import { getDb } from './database';

export type RecipeStep = {
  paintName: string;
  technique: string;
};

export type Recipe = {
  id: number;
  name: string;
  photoUri: string | null;
  steps: RecipeStep[];
  createdAt: number;
  updatedAt: number;
};

export type RecipeInput = {
  name: string;
  steps: RecipeStep[];
};

type RecipeRow = {
  id: number;
  name: string;
  photo_uri: string | null;
  created_at: number;
  updated_at: number;
};

type RecipeStepRow = {
  recipe_id: number;
  paint_name: string;
  technique: string;
};

async function loadSteps(db: Awaited<ReturnType<typeof getDb>>, recipeIds: number[]): Promise<Map<number, RecipeStep[]>> {
  const map = new Map<number, RecipeStep[]>();
  if (recipeIds.length === 0) return map;
  const placeholders = recipeIds.map(() => '?').join(',');
  const rows = await db.getAllAsync<RecipeStepRow>(
    `SELECT recipe_id, paint_name, technique FROM recipe_steps WHERE recipe_id IN (${placeholders}) ORDER BY recipe_id, step_order`,
    ...recipeIds
  );
  for (const row of rows) {
    const list = map.get(row.recipe_id) ?? [];
    list.push({ paintName: row.paint_name, technique: row.technique });
    map.set(row.recipe_id, list);
  }
  return map;
}

function rowToRecipe(row: RecipeRow, steps: RecipeStep[]): Recipe {
  return {
    id: row.id,
    name: row.name,
    photoUri: row.photo_uri,
    steps,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listRecipes(): Promise<Recipe[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<RecipeRow>('SELECT * FROM recipes ORDER BY updated_at DESC');
  const stepsByRecipe = await loadSteps(db, rows.map((r) => r.id));
  return rows.map((row) => rowToRecipe(row, stepsByRecipe.get(row.id) ?? []));
}

export async function getRecipe(id: number): Promise<Recipe | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<RecipeRow>('SELECT * FROM recipes WHERE id = ?', id);
  if (!row) return null;
  const stepsByRecipe = await loadSteps(db, [id]);
  return rowToRecipe(row, stepsByRecipe.get(id) ?? []);
}

async function replaceSteps(db: Awaited<ReturnType<typeof getDb>>, recipeId: number, steps: RecipeStep[]): Promise<void> {
  await db.runAsync('DELETE FROM recipe_steps WHERE recipe_id = ?', recipeId);
  for (let i = 0; i < steps.length; i++) {
    await db.runAsync(
      'INSERT INTO recipe_steps (recipe_id, step_order, paint_name, technique) VALUES (?, ?, ?, ?)',
      recipeId,
      i,
      steps[i].paintName,
      steps[i].technique
    );
  }
}

export async function createRecipe(input: RecipeInput): Promise<number> {
  const db = await getDb();
  const now = Date.now();
  const result = await db.runAsync(
    'INSERT INTO recipes (name, created_at, updated_at) VALUES (?, ?, ?)',
    input.name,
    now,
    now
  );
  await replaceSteps(db, result.lastInsertRowId, input.steps);
  return result.lastInsertRowId;
}

export async function updateRecipe(id: number, input: RecipeInput): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE recipes SET name = ?, updated_at = ? WHERE id = ?', input.name, Date.now(), id);
  await replaceSteps(db, id, input.steps);
}

export async function setRecipePhoto(id: number, photoUri: string | null): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE recipes SET photo_uri = ? WHERE id = ?', photoUri, id);
}

export async function deleteRecipe(id: number): Promise<void> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ photo_uri: string | null }>('SELECT photo_uri FROM recipes WHERE id = ?', id);
  await db.runAsync('DELETE FROM recipes WHERE id = ?', id);
  if (row?.photo_uri) await deletePhotoFile(row.photo_uri);
}

export async function getPinnedUnitIds(recipeId: number): Promise<number[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ unit_id: number }>(
    'SELECT unit_id FROM unit_recipe_pins WHERE recipe_id = ?',
    recipeId
  );
  return rows.map((r) => r.unit_id);
}

export async function setPinnedUnits(recipeId: number, unitIds: number[]): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM unit_recipe_pins WHERE recipe_id = ?', recipeId);
  for (const unitId of unitIds) {
    await db.runAsync('INSERT INTO unit_recipe_pins (unit_id, recipe_id) VALUES (?, ?)', unitId, recipeId);
  }
}

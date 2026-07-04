import { getDb } from './database';

// Returns the stored allegiance order, with any allegiances missing from
// storage appended at the end in their default relative order.
export async function getAllegianceOrder(defaultOrder: string[]): Promise<string[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ allegiance: string }>(
    'SELECT allegiance FROM allegiance_order ORDER BY sort_order ASC'
  );
  const stored = rows.map((r) => r.allegiance);
  const missing = defaultOrder.filter((a) => !stored.includes(a));
  return [...stored.filter((a) => defaultOrder.includes(a)), ...missing];
}

export async function setAllegianceOrder(order: string[]): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM allegiance_order');
  for (let i = 0; i < order.length; i++) {
    await db.runAsync('INSERT INTO allegiance_order (allegiance, sort_order) VALUES (?, ?)', order[i], i);
  }
}

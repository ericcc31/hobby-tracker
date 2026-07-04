import { getDb } from './database';

export const ALLEGIANCE_ORDER_KEY = '__allegiances__';

export function armyOrderKey(allegiance: string): string {
  return `armies:${allegiance}`;
}

// Returns the stored order for a group, with any items missing from storage
// appended at the end in their default relative order.
export async function getOrder(groupKey: string, defaultOrder: string[]): Promise<string[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ item: string }>(
    'SELECT item FROM sort_order WHERE group_key = ? ORDER BY position ASC',
    groupKey
  );
  const stored = rows.map((r) => r.item);
  const missing = defaultOrder.filter((a) => !stored.includes(a));
  return [...stored.filter((a) => defaultOrder.includes(a)), ...missing];
}

export async function setOrder(groupKey: string, order: string[]): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM sort_order WHERE group_key = ?', groupKey);
  for (let i = 0; i < order.length; i++) {
    await db.runAsync('INSERT INTO sort_order (group_key, item, position) VALUES (?, ?, ?)', groupKey, order[i], i);
  }
}

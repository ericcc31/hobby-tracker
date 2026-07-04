import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('wetpalette.db').then(async (db) => {
      await db.execAsync(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS units (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          army TEXT NOT NULL DEFAULT '',
          chapter TEXT,
          stage TEXT NOT NULL DEFAULT 'bought',
          notes TEXT NOT NULL DEFAULT '',
          in_progress INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS recipes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS recipe_steps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
          step_order INTEGER NOT NULL,
          paint_name TEXT NOT NULL,
          technique TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS unit_recipe_pins (
          unit_id INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
          recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
          PRIMARY KEY (unit_id, recipe_id)
        );

        CREATE TABLE IF NOT EXISTS unit_stage_photos (
          unit_id INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
          stage TEXT NOT NULL,
          photo_uri TEXT NOT NULL,
          taken_at INTEGER NOT NULL,
          PRIMARY KEY (unit_id, stage)
        );

        DROP TABLE IF EXISTS allegiance_order;

        CREATE TABLE IF NOT EXISTS sort_order (
          group_key TEXT NOT NULL,
          item TEXT NOT NULL,
          position INTEGER NOT NULL,
          PRIMARY KEY (group_key, item)
        );

        ALTER TABLE recipes ADD COLUMN IF NOT EXISTS photo_uri TEXT;
      `);
      return db;
    });
  }
  return dbPromise;
}

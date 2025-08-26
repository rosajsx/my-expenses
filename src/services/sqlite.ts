import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('my-expenses.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        name TEXT,
        amount REAL,
        type INTEGER,
        installment INTEGER,
        installment_qtd INTEGER,
        category_id INTEGER,
        is_fixed INTEGER,
        date TEXT,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `);
  }
  return db;
}

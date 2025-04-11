import { SQLiteDatabase } from 'expo-sqlite';

export async function createBalanceHistoryTable(db: SQLiteDatabase) {
  return db
    .execAsync(
      `
    PRAGMA journal_mode = 'wal';
    CREATE TABLE IF NOT EXISTS balance_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      balance INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    )
    `,
    )
    .then(() => console.log('balance_history Table Created'))
    .catch((error) => {
      throw error;
    });
}

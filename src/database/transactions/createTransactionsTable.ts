import { SQLiteDatabase } from 'expo-sqlite';

export async function createTransactionsTable(db: SQLiteDatabase) {
  return db
    .execAsync(
      `
  PRAGMA journal_mode = 'wal';
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    type INTEGER NOT NULL,
    installment INTEGER,
    installment_qtd INTEGER,
    date TEXT NOT NULL,
    updated_at TEXT,
    created_at TEXT NOT NULL,
    pendingSync INTEGER DEFAULT 1,
    deleted INTEGER DEFAULT 0,
    category TEXT
  )
`,
    )
    .then(() => console.log('transactions Table Created'))
    .catch((error) => {
      throw error;
    });
}

import { SQLiteDatabase } from 'expo-sqlite';

export async function createTransactionsTable(db: SQLiteDatabase) {
  return db
    .execAsync(
      `
  PRAGMA journal_mode = 'wal';
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    type INTEGER NOT NULL,
    installment INTEGER,
    installment_qtd INTEGER,
    date TEXT NOT NULL
  )
`,
    )
    .then(() => console.log('transactions Table Created'))
    .catch((error) => {
      throw error;
    });
}

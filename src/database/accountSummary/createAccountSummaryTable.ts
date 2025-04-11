import { SQLiteDatabase } from 'expo-sqlite';

export async function createAccountSummaryTable(db: SQLiteDatabase) {
  return db
    .withTransactionAsync(async () => {
      await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS account_summary (
        id INTEGER PRIMARY KEY NOT NULL,
        total INTEGER NOT NULL,
        last_updated TEXT NOT NULL
      )
      `);
      await db.runAsync(
        `INSERT OR IGNORE INTO account_summary (id, total, last_updated) VALUES (1, 0, datetime('now'))`,
      );
    })
    .then(() => console.log('account_summary Table Created'))
    .catch((error) => {
      throw error;
    });
}

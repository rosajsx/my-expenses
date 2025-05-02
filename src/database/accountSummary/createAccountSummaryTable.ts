import { SQLiteDatabase } from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';

export async function createAccountSummaryTable(db: SQLiteDatabase) {
  const user_id = await Storage.getItem('my-expenses-user-hash');

  if (!user_id) {
    throw new Error('User Hash not found');
  }
  return db
    .withTransactionAsync(async () => {
      await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS account_summary (
        id TEXT PRIMARY KEY NOT NULL,
        total INTEGER NOT NULL,
        last_updated TEXT NOT NULL
      )
      `);
      await db.runAsync(
        `INSERT OR IGNORE INTO account_summary (id, total, last_updated) VALUES (?, 0, datetime('now'))`,
        [user_id],
      );
    })
    .then(() => console.log('account_summary Table Created'))
    .catch((error) => {
      throw error;
    });
}

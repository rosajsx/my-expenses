import { SQLiteDatabase } from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';

export async function updateCachedBalance(db: SQLiteDatabase, changeAmount: number) {
  const now = new Date().toISOString();

  const user_id = await Storage.getItem('my-expenses-user-hash');

  if (!user_id) {
    throw new Error('User Hash not found');
  }

  return db.withTransactionAsync(async () => {
    await db.runAsync(
      `
      UPDATE account_summary
      SET total = total + ?, last_updated = ?
      WHERE id = 1 AND id = ?
      `,
      [changeAmount, now, user_id],
    );

    await db.runAsync(
      `
      INSERT INTO balance_history (balance, updated_at)
      SELECT total, ? from account_summary WHERE id = 1
      `,
      [now],
    );
  });
}

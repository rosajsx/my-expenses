import { SQLiteDatabase } from 'expo-sqlite';

export async function updateCachedBalance(db: SQLiteDatabase, changeAmount: number) {
  const now = new Date().toISOString();
  console.log('here');
  return db.withTransactionAsync(async () => {
    await db.runAsync(
      `
      UPDATE account_summary
      SET total = total + ?, last_updated = ?
      WHERE id = 1
      `,
      [changeAmount, now],
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

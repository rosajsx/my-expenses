import { SQLiteDatabase } from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';

export async function getCacheAccountBalance(db: SQLiteDatabase) {
  let balance = 0;

  const user_id = await Storage.getItem('my-expenses-user-hash');

  if (!user_id) {
    throw new Error('User Hash not found');
  }

  await db.withTransactionAsync(async () => {
    const total = (await getBalance(db)) as any;

    const now = new Date().toISOString();

    await db.runAsync(
      `
        UPDATE account_summary
        SET total=?, last_updated=?
        WHERE id = ?
        `,
      [total.balance, now, user_id],
    );

    await db.runAsync(
      `
        INSERT INTO balance_history (balance, updated_at, user_id)
        VALUES (?, ?, ?)
        `,
      [total.balance, now, user_id],
    );
    balance = total.balance;
  });

  return balance;
}

async function getBalance(db: SQLiteDatabase) {
  const user_id = await Storage.getItem('my-expenses-user-hash');

  if (!user_id) {
    throw new Error('User Hash not found');
  }
  return db.getFirstAsync(
    `
    SELECT 
      IFNULL(SUM(CASE WHEN type = 1 THEN amount ELSE 0 END), 0) -
      IFNULL(SUM(CASE WHEN type = 2 THEN amount ELSE 0 END), 0)
    AS balance
    FROM transactions WHERE deleted = 0 AND user_id = ?
    `,
    [user_id],
  );
}

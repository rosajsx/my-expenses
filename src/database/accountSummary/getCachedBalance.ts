import { useBoundStore } from '@/store';
import { SQLiteDatabase } from 'expo-sqlite';

export async function getCacheAccountBalance(db: SQLiteDatabase) {
  let balance = 0;

  const { session } = useBoundStore.getState();

  if (!session?.user) {
    throw new Error('User  not found');
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
      [total.balance, now, session.user.id],
    );

    await db.runAsync(
      `
        INSERT INTO balance_history (balance, updated_at, user_id)
        VALUES (?, ?, ?)
        `,
      [total.balance, now, session.user.id],
    );
    balance = total.balance;
  });

  return balance;
}

async function getBalance(db: SQLiteDatabase) {
  const { session } = useBoundStore.getState();

  if (!session?.user) {
    throw new Error('User  not found');
  }
  return db.getFirstAsync(
    `
    SELECT 
      IFNULL(SUM(CASE WHEN type = 1 THEN amount ELSE 0 END), 0) -
      IFNULL(SUM(CASE WHEN type = 2 THEN amount ELSE 0 END), 0)
    AS balance
    FROM transactions WHERE deleted = 0 AND user_id = ?
    `,
    [session.user.id],
  );
}

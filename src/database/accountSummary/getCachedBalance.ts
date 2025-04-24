import { SQLiteDatabase } from 'expo-sqlite';
import { AccountSummary } from '../types';

export async function getCacheAccountBalance(db: SQLiteDatabase) {
  let balance = 0;
  await db.withTransactionAsync(async () => {
    const total = (await getBalance(db)) as any;

    const now = new Date().toISOString();

    await db.runAsync(
      `
        UPDATE account_summary
        SET total=?, last_updated=?
        WHERE id=1
        `,
      [total.balance, now],
    );

    await db.runAsync(
      `
        INSERT INTO balance_history (balance, updated_at)
        VALUES (?, ?)
        `,
      [total.balance, now],
    );
    balance = total.balance;
  });

  return balance;
}

async function getBalance(db: SQLiteDatabase) {
  return db.getFirstAsync(`
    SELECT 
      IFNULL(SUM(CASE WHEN type = 1 THEN amount ELSE 0 END), 0) -
      IFNULL(SUM(CASE WHEN type = 2 THEN amount ELSE 0 END), 0)
    AS balance
    FROM transactions WHERE deleted = 0
    `);
}

import { SQLiteDatabase } from 'expo-sqlite';
import { AccountSummary } from '../types';

export async function getCacheAccountBalance(db: SQLiteDatabase) {
  let balance = 0;
  await db.withTransactionAsync(async () => {
    const data = await db.getAllAsync<AccountSummary>('SELECT * FROM account_summary WHERE id = 1');

    const cache = data[0];
    const today = new Date().toISOString().slice(0, 10);

    if (!cache || !cache.last_updated.startsWith(today)) {
      const total = (await getBalance(db)) as any;
      console.log({ total });

      const now = new Date().toISOString();

      await db.runAsync(
        `
        UPDATE account_summary
        SET total=?, last_updated=?
        WHERE id=1
        `,
        [total.balance, now],
      );
      console.log({ now });
      await db.runAsync(`
        INSERT INTO balance_history (balance, updated_at)
        VALUES (?, ?)
        `),
        [total, now];

      balance = total;
    } else {
      balance = cache.total;
    }
  });

  console.log({ balance });
  return balance;
}

async function getBalance(db: SQLiteDatabase) {
  return db.getFirstAsync(`
    SELECT 
      IFNULL(SUM(CASE WHEN type = 1 THEN amount ELSE 0 END), 0) -
      IFNULL(SUM(CASE WHEN type = 2 THEN amount ELSE 0 END), 0)
    AS balance
    FROM transactions
    `);
}

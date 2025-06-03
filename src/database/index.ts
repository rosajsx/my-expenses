import { SQLiteDatabase } from 'expo-sqlite';
import { createAccountSummaryTable } from './accountSummary/createAccountSummaryTable';
import { createBalanceHistoryTable } from './balanceHistory/createBalanceHistoryTable';
import { createTransactionsTable } from './transactions/createTransactionsTable';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  let { user_version: currentDbVersion } = (await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  )) || { user_version: 0 };

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    try {
      await createTransactionsTable(db);

      await createAccountSummaryTable(db);

      await createBalanceHistoryTable(db);

      console.log('Database created and migrated to version 1');
      // await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
      // await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
      currentDbVersion = 1;
    } catch (error) {
      console.error('Database not created', error);
    }
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

import { SQLiteDatabase } from 'expo-sqlite';
import { createTransactionsTable } from './transactions/createTransactionsTable';
import { createAccountSummaryTable } from './accountSummary/createAccountSummaryTable';
import { createBalanceHistoryTable } from './balanceHistory/createBalanceHistoryTable';
import Storage from 'expo-sqlite/kv-store';
import * as Crypto from 'expo-crypto';
import { syncTransactions } from './transactions/syncTransactions';
import { removeDeletedTransactions } from './transactions/removeDeletedTransactions';
import { hashKey } from '@/store/slices/authStore';

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

      const userHash = await Storage.getItem(hashKey);
      if (!userHash) {
        throw new Error("User hash wasn't created");
      }

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

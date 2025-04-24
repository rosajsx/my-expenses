import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';
import Storage from 'expo-sqlite/kv-store';

export async function getPendingTransactions(db: SQLiteDatabase) {
  const user_id = await Storage.getItem('my-expenses-user-hash');

  if (!user_id) {
    throw new Error('User Hash not found');
  }

  return db.getAllAsync<Transaction>(
    `SELECT * FROM transactions WHERE pendingSync = 1 AND user_id = ?`,
    user_id,
  );
}

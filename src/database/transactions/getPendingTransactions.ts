import { useBoundStore } from '@/store';
import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';

export async function getPendingTransactions(db: SQLiteDatabase) {
  const { session } = useBoundStore.getState();

  if (!session?.user) {
    throw new Error('User  not found');
  }

  return db.getAllAsync<Transaction>(
    `SELECT * FROM transactions WHERE pendingSync = 1 AND user_id = ?`,
    session?.user?.id,
  );
}

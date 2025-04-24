import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';

export async function getPendingTransactions(db: SQLiteDatabase) {
  return db.getAllAsync<Transaction>(`SELECT * FROM transactions WHERE pendingSync = 1`);
}

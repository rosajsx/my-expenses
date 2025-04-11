import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';

export async function getAllTransactions(db: SQLiteDatabase) {
  return db.getAllAsync<Transaction>(`SELECT * FROM transactions ORDER BY id DESC;`);
}

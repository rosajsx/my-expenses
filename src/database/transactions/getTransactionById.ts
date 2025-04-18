import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';

export async function getTransactionById(db: SQLiteDatabase, id: string) {
  return db.getFirstAsync<Transaction>('SELECT * FROM transactions WHERE id=?', id);
}

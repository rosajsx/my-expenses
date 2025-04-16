import { SQLiteDatabase } from 'expo-sqlite';
import { updateCachedBalance } from '../accountSummary/updateCachedBalance';
import { Transaction } from '../types';

export async function deleteTransaction(db: SQLiteDatabase, transaction: Transaction) {
  await db.runAsync('DELETE FROM transactions WHERE id=$value', { $value: transaction.id });
  await updateCachedBalance(db, transaction.type === 1 ? -transaction.amount : transaction.amount);
}

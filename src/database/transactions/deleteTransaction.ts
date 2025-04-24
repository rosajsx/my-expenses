import { SQLiteDatabase } from 'expo-sqlite';
import { updateCachedBalance } from '../accountSummary/updateCachedBalance';
import { Transaction } from '../types';

export async function deleteTransaction(
  db: SQLiteDatabase,
  transaction: Pick<Transaction, 'id' | 'amount' | 'type'>,
) {
  await db.runAsync(
    'UPDATE transactions SET deleted = 1, updated_at = ?, pendingSync = 1 WHERE id = ?',
    [new Date().toISOString(), transaction.id],
  );
  await updateCachedBalance(db, transaction.type === 1 ? -transaction.amount : transaction.amount);
}

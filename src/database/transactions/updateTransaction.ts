import { SQLiteDatabase } from 'expo-sqlite';
import { updateCachedBalance } from '../accountSummary/updateCachedBalance';

interface UpdateTransactionInput {
  id: string;
  name: string;
  amount: number;
  type: number;
  date: string;
}

export async function updateTransaction(db: SQLiteDatabase, input: UpdateTransactionInput) {
  try {
    await db.runAsync(
      'UPDATE transactions SET name = ?, amount = ?, type = ?, date = ?, updated_at = ?, pendingSync = 1 WHERE id = ? AND deleted = 0',
      [input.name, input.amount, input.type, input.date, input.id, new Date().toISOString()],
    );
    await updateCachedBalance(db, input.type === 1 ? input.amount : -input.amount);
  } catch (error) {
    throw error;
  }
}

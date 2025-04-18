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
      'UPDATE transactions SET name = ?, amount = ?, type = ?, date = ? WHERE id = ?',
      [input.name, input.amount, input.type, input.date, input.id],
    );
    await updateCachedBalance(db, input.type === 1 ? input.amount : -input.amount);
  } catch (error) {
    throw error;
  }
}

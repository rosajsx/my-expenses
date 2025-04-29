import { SQLiteDatabase } from 'expo-sqlite';
import { updateCachedBalance } from '../accountSummary/updateCachedBalance';

interface UpdateTransactionInput {
  id: string;
  name: string;
  amount: number;
  type: number;
  date: string;
  category: string;
}

export async function updateTransaction(db: SQLiteDatabase, input: UpdateTransactionInput) {
  try {
    await db
      .runAsync(
        'UPDATE transactions SET name = ?, amount = ?, type = ?, date = ?, updated_at = ?, pendingSync = 1, category = ? WHERE id = ? AND deleted = 0',
        [
          input.name,
          input.amount,
          input.type,
          input.date,
          new Date().toISOString(),
          input.category,
          input.id,
        ],
      )
      .then((response) => console.log('update', response.changes, response.lastInsertRowId));
    await updateCachedBalance(db, input.type === 1 ? input.amount : -input.amount);
  } catch (error) {
    console.log('deu erro', error);
    throw error;
  }
}

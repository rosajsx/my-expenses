import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';
import { updateCachedBalance } from '../accountSummary/updateCachedBalance';
import { formatDateForSQLite } from '@/src/utils';
import Storage from 'expo-sqlite/kv-store';

export async function createTransaction(
  db: SQLiteDatabase,
  { name, amount, installment, date, type, installment_qtd }: Omit<Transaction, 'id' | 'user_id'>,
) {
  try {
    const formattedDate = formatDateForSQLite(new Date(date));

    const user_id = await Storage.getItem('my-expenses-user-hash');

    if (!user_id) {
      throw new Error('User Hash not found');
    }

    await createTransactionQuery(db, {
      name,
      amount,
      installment,
      installment_qtd,
      date: formattedDate,
      user_id,
      type,
    });
    await updateCachedBalance(db, type === 1 ? amount : -amount);
  } catch (error) {
    throw error;
  }
}

async function createTransactionQuery(
  db: SQLiteDatabase,
  {
    name,
    amount,
    installment,
    date,
    type,
    installment_qtd,
    user_id,
  }: Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'deleted'>,
) {
  return db.runAsync(
    `INSERT OR REPLACE INTO transactions (name, amount, installment, type, date, installment_qtd, pendingSync, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    name,
    amount,
    installment,
    type,
    date,
    installment_qtd,
    1,
    user_id,
    new Date().toISOString(),
  );
}

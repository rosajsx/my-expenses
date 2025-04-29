import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';
import { updateCachedBalance } from '../accountSummary/updateCachedBalance';
import { formatDateForSQLite } from '@/src/utils';
import Storage from 'expo-sqlite/kv-store';
import * as Crypto from 'expo-crypto';

export async function createTransaction(
  db: SQLiteDatabase,
  {
    name,
    amount,
    installment,
    date,
    type,
    installment_qtd,
    category,
  }: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted'>,
) {
  try {
    const formattedDate = formatDateForSQLite(new Date(date));

    const user_id = await Storage.getItem('my-expenses-user-hash');

    if (!user_id) {
      throw new Error('User Hash not found');
    }

    const id = Crypto.randomUUID();

    await createTransactionQuery(db, {
      id,
      name,
      amount,
      installment,
      installment_qtd,
      date: formattedDate,
      user_id,
      type,
      category,
    });
    await updateCachedBalance(db, type === 1 ? amount : -amount);
  } catch (error) {
    throw error;
  }
}

async function createTransactionQuery(
  db: SQLiteDatabase,
  {
    id,
    name,
    amount,
    installment,
    date,
    type,
    installment_qtd,
    user_id,
    category,
  }: Omit<Transaction, 'created_at' | 'updated_at' | 'deleted'>,
) {
  return db.runAsync(
    `INSERT OR REPLACE INTO transactions (id,name, amount, installment, type, date, installment_qtd, pendingSync, user_id, created_at, deleted, category) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    name,
    amount,
    installment,
    type,
    date,
    installment_qtd,
    1,
    user_id,
    new Date().toISOString(),
    0,
    category,
  );
}

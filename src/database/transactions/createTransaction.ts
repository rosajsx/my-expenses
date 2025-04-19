import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';
import { updateCachedBalance } from '../accountSummary/updateCachedBalance';
import { formatDateForSQLite } from '@/src/utils';

export async function createTransaction(
  db: SQLiteDatabase,
  { name, amount, installment, date, type, installment_qtd }: Omit<Transaction, 'id'>,
) {
  try {
    const formattedDate = formatDateForSQLite(new Date(date));

    await createTransactionQuery(db, {
      name,
      amount,
      installment,
      installment_qtd,
      date: formattedDate,
      type,
    });
    await updateCachedBalance(db, type === 1 ? amount : -amount);
  } catch (error) {
    throw error;
  }
}

async function createTransactionQuery(
  db: SQLiteDatabase,
  { name, amount, installment, date, type, installment_qtd }: Omit<Transaction, 'id'>,
) {
  return db.runAsync(
    `INSERT INTO transactions (name, amount, installment, type, date, installment_qtd) VALUES (?, ?, ?, ?, ?, ?)`,
    name,
    amount,
    installment,
    type,
    date,
    installment_qtd,
  );
}

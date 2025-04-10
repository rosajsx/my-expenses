import { SQLiteDatabase } from 'expo-sqlite';
import { Income } from '../types';

export async function createIncome(
  db: SQLiteDatabase,
  { name, amount, installment, date, type, installmentQtd }: Omit<Income, 'id'>,
) {
  return db.runAsync(
    `INSERT INTO incomes (name, amount, installment, type, date, installmentQtd) VALUES (?, ?, ?, ?, ?, ?)`,
    name,
    amount,
    installment,
    type,
    date,
    installmentQtd,
  );
}

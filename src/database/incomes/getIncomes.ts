import { SQLiteDatabase } from 'expo-sqlite';
import { Income } from '../types';

export async function getIncomes(db: SQLiteDatabase) {
  return db.getAllAsync<Income>(`SELECT * FROM incomes;`);
}

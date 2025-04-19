import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';

interface FilterParams {
  year?: number;
  month?: number;
}

export async function getAllTransactions(db: SQLiteDatabase, filter?: FilterParams) {
  if (typeof filter?.month === 'number' && filter?.year) {
    const isTwoDigitsMonth = filter.month < 10;
    return db.getAllAsync<Transaction>(
      `SELECT * FROM transactions WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?  ORDER BY date DESC;`,
      [isTwoDigitsMonth ? `0${filter.month + 1}` : filter.month + 1, `${filter.year}`],
    );
  }

  if (typeof filter?.month === 'number') {
    const isTwoDigitsMonth = filter.month < 10;
    return db.getAllAsync<Transaction>(
      `SELECT * FROM transactions WHERE strftime('%m', date) = ? ORDER BY date DESC;`,
      [isTwoDigitsMonth ? `0${filter.month + 1}` : filter.month + 1],
    );
  }

  if (filter?.year) {
    return db.getAllAsync<Transaction>(
      `SELECT * FROM transactions WHERE strftime('%Y', date) = ? ORDER BY date DESC;`,
      [`${filter?.year}`],
    );
  }

  return db.getAllAsync<Transaction>(`SELECT * FROM transactions ORDER BY date DESC;`);
}

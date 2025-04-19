import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';

interface FilterParams {
  year?: number;
  month?: number;
  transactionType?: number;
}

export async function getAllTransactions(db: SQLiteDatabase, filter?: FilterParams) {
  let query = '';
  let params = [];

  if (typeof filter?.month === 'number') {
    const isTwoDigitsMonth = filter.month < 10;
    query = `${query} WHERE strftime('%m', date) = ?`;
    params.push(isTwoDigitsMonth ? `0${filter.month + 1}` : filter.month + 1);
  }

  if (filter?.year) {
    if (params.length > 0) {
      query = `${query} AND strftime('%Y', date) = ?`;
    } else {
      query = `${query} WHERE strftime('%Y', date) = ?`;
    }

    params.push(`${filter?.year}`);
  }

  if (filter?.transactionType) {
    if (params.length > 0) {
      query = `${query} AND type=?`;
    } else {
      query = `${query} WHERE type=?`;
    }
    params.push(filter.transactionType);
  }

  return db.getAllAsync<Transaction>(
    `SELECT * FROM transactions ${query} ORDER BY date DESC;`,
    params,
  );
}

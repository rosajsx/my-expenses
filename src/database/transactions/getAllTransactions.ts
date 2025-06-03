import { useBoundStore } from '@/store';
import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';

export interface FilterParams {
  year?: number;
  month?: number;
  transactionType?: number;
}

export async function getAllTransactions(db: SQLiteDatabase, filter?: FilterParams) {
  let query = '';
  let params = [];

  const { session } = useBoundStore.getState();

  if (!session?.user?.id) {
    throw new Error('User  not found');
  }

  if (typeof filter?.month === 'number') {
    const isTwoDigitsMonth = filter.month < 10;
    query = `${query} AND strftime('%m', date) = ?`;
    params.push(isTwoDigitsMonth ? `0${filter.month + 1}` : filter.month + 1);
  }

  if (filter?.year) {
    query = `${query} AND strftime('%Y', date) = ?`;

    params.push(`${filter?.year}`);
  }

  if (filter?.transactionType) {
    query = `${query} AND type=?`;

    params.push(filter.transactionType);
  }

  return db.getAllAsync<Transaction>(
    `SELECT * FROM transactions  WHERE user_id = ? ${query} ORDER BY date DESC;`,
    [session?.user?.id, ...params],
  );
}

import { useBoundStore } from '@/store';
import { SQLiteDatabase } from 'expo-sqlite';

export const getMonthBalance = async (db: SQLiteDatabase, month: string) => {
  const year = new Date().getFullYear();

  const haveMonthTwoDigits = month.length > 1;

  const { session } = useBoundStore.getState();

  if (!session?.user) {
    throw new Error('User  not found');
  }

  return db.getFirstAsync<{ total: number }>(
    `SELECT 
       SUM(CASE WHEN type = 1  THEN amount ELSE 0 END) -
       SUM(CASE WHEN type = 2  THEN amount ELSE 0 END) AS total
       FROM transactions
       WHERE strftime('%Y', date) = ?
       AND strftime('%m', date) = ?
       AND user_id = ?
       AND deleted = 0
       `,
    [`${year}`, haveMonthTwoDigits ? month : `0${month}`, session.user.id],
  );
};

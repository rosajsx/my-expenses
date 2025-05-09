import { SQLiteDatabase } from 'expo-sqlite';

export type BalanceType = {
  month: string;
  total: number;
  total_in: number;
  total_out: number;
};

export async function getBalancePerMonth(db: SQLiteDatabase) {
  return db.getAllAsync<BalanceType>(`
      SELECT strftime('%Y-%m', date) AS month,
      SUM(CASE WHEN type = 1 AND deleted = 0 THEN amount ELSE 0 END) AS total_in,
      SUM(CASE WHEN type = 2 AND deleted = 0 THEN amount ELSE 0 END) AS total_out,
      (SUM(CASE WHEN type = 1 AND deleted = 0 THEN amount ELSE 0 END) - SUM(CASE WHEN type = 2 AND deleted = 0 THEN amount ELSE 0 END)) AS total
      FROM transactions 
      GROUP BY month
      ORDER BY month DESC;
      
      `);
}

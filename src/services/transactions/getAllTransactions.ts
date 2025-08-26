import { getDB } from '../sqlite';

interface IFilter {
  month?: number;
  year?: string;
  transactionType?: number;
}

export const getAllTransactions = async (user_id: string, filters?: IFilter) => {
  const db = await getDB();
  let query = `SELECT t.*, c.id as category_id, c.name as category_name
               FROM transactions t
               LEFT JOIN categories c ON t.category_id = c.id
               WHERE t.user_id = ? AND t.is_fixed = 0`;
  const params: any[] = [user_id];

  const year = filters?.year;
  if (filters?.month && filters?.year) {
    query += ' AND date >= ? AND date < ?';
    params.push(`${year}-${filters.month + 1}-01`);
    params.push(`${year}-${filters.month + 2}-01`);
  } else if (filters?.month && !filters?.year) {
    query += ' AND date >= ? AND date < ?';
    params.push(`2022-${filters.month + 1}-01`);
    params.push(`${new Date().getFullYear()}-${filters.month + 2}-01`);
  } else if (!filters?.month && filters?.year) {
    query += ' AND date >= ? AND date < ?';
    params.push(`${filters.year}-01-01`);
    params.push(`${filters.year}-12-31`);
  }

  if (filters?.transactionType) {
    query += ' AND type = ?';
    params.push(filters.transactionType);
  }

  const rows = await db.getAllAsync(query, params);
  const data = rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    created_at: row.created_at,
    name: row.name,
    amount: row.amount,
    type: row.type,
    is_fixed: !!row.is_fixed,
    installment: row.installment,
    installment_qtd: row.installment_qtd,
    date: row.date,
    updated_at: row.updated_at,
    categories: row.category_id ? { id: row.category_id, name: row.category_name } : null,
  }));
  return { data, error: null };
};

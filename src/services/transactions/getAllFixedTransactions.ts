import { getDB } from '../sqlite';

export const getAllFixedTransactions = async (user_id: string) => {
  const db = await getDB();
  const rows = await db.getAllAsync(
    `SELECT t.*, c.id as category_id, c.name as category_name
     FROM transactions t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.is_fixed = 1 AND t.user_id = ?`,
    [user_id],
  );
  const data = rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    created_at: row.created_at,
    name: row.name,
    amount: row.amount,
    type: row.type,
    installment: row.installment,
    is_fixed: !!row.is_fixed,
    installment_qtd: row.installment_qtd,
    date: row.date,
    updated_at: row.updated_at,
    categories: row.category_id ? { id: row.category_id, name: row.category_name } : null,
  }));
  return { data, error: null };
};

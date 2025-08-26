import { getDB } from '../sqlite';

export const getTransactionById = async (user_id: string, transaction_id: number) => {
  const db = await getDB();
  const rows = await db.getAllAsync(
    `SELECT t.*, c.id as category_id, c.name as category_name
     FROM transactions t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = ? AND t.id = ?
     LIMIT 1`,
    [user_id, transaction_id],
  );
  const row = rows[0];
  const data =
    row && {
      id: row.id,
      user_id: row.user_id,
      created_at: row.created_at,
      name: row.name,
      amount: row.amount,
      type: row.type,
      installment: row.installment,
      installment_qtd: row.installment_qtd,
      is_fixed: !!row.is_fixed,
      date: row.date,
      updated_at: row.updated_at,
      categories: row.category_id
        ? { id: row.category_id, name: row.category_name }
        : null,
    };
  return { data, error: null };
};

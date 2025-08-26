import { ITransaction } from '@/store/transactions/transactions.types';
import { getDB } from '../sqlite';

type Params = Omit<ITransaction, 'created_at' | 'updated_at' | 'user_id'>;

export const updateTransaction = async (
  user_id: string,
  { created_at, ...data }: Partial<Params>,
) => {
  const db = await getDB();
  await db.runAsync(
    `UPDATE transactions SET name = ?, amount = ?, type = ?, installment = ?, installment_qtd = ?, category_id = ?, is_fixed = ?, date = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
    [
      data.name,
      data.amount,
      data.type,
      data.installment,
      data.installment_qtd,
      data.category_id,
      data.is_fixed ? 1 : 0,
      data.is_fixed ? null : data.date,
      data.id,
      user_id,
    ],
  );
  return { data: null, error: null };
};

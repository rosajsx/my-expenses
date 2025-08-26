import { ITransaction } from '@/store/transactions/transactions.types';
import { getDB } from '../sqlite';

type Params = Omit<ITransaction, 'id' | 'created_at' | 'updated_at' | 'user_id'>;

export const createTransaction = async (user_id: string, input: Params) => {
  const db = await getDB();
  const { amount, name, type, date, installment, installment_qtd, category_id, is_fixed } = input;
  await db.runAsync(
    `INSERT INTO transactions (user_id, amount, name, type, installment, installment_qtd, category_id, is_fixed, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      amount,
      name,
      type,
      installment,
      installment_qtd,
      category_id,
      is_fixed ? 1 : 0,
      is_fixed ? null : date,
    ],
  );
  return { data: null, error: null };
};

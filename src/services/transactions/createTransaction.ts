import { ITransaction } from '@/store/transactions/transactions.types';
import { supabase } from '../supabase';

type Params = Omit<ITransaction, 'id' | 'created_at' | 'updated_at' | 'user_id'>;

export const createTransaction = async (user_id: string, input: Params) => {
  const { amount, name, type, date, installment, installment_qtd, category_id, is_fixed } = input;
  return supabase
    .from('transactions')
    .insert({
      user_id,
      amount,
      name,
      type,
      installment,
      installment_qtd,
      category_id,
      is_fixed,
      date: is_fixed ? null : date,
    })
    .throwOnError();
};

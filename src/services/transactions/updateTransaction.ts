import { ITransaction } from '@/store/slices/transactionsSlice';
import { supabase } from '../supabase';

type Params = Omit<ITransaction, 'created_at' | 'updated_at' | 'user_id'>;

export const updateTransaction = async (
  user_id: string,
  { created_at, ...data }: Partial<Params>,
) => {
  return supabase
    .from('transactions')
    .update({ ...data, date: data.is_fixed ? null : data.date })
    .eq('id', data.id!)
    .eq('user_id', user_id)
    .throwOnError();
};

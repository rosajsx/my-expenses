import { ITransaction } from '@/store/slices/transactionsSlice';
import { supabase } from '../supabase';

type Params = Omit<ITransaction, 'id' | 'created_at' | 'updated_at' | 'user_id'>;

export const createTransaction = async (user_id: string, input: Params) => {
  return supabase
    .from('transactions')
    .insert({
      user_id,
      ...input,
    })
    .throwOnError();
};

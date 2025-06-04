import { supabase } from '../supabase';

export const getTransactionById = async (user_id: string, transaction_id: number) => {
  return supabase
    .from('transactions')
    .select()
    .eq('user_id', user_id)
    .eq('id', transaction_id)
    .single()
    .throwOnError();
};

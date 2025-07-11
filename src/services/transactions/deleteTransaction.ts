import { supabase } from '../supabase';

export const deleteTransactionById = async (user_id: string, transactionID: number) => {
  return supabase
    .from('transactions')
    .delete()
    .eq('id', transactionID)
    .eq('user_id', user_id)
    .throwOnError();
};

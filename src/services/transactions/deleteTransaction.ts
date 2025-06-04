import { supabase } from '../supabase';

export const deleteTransactionById = async (user_id: string, transactionID: number) => {
  console.log({ user_id, transactionID });
  return supabase
    .from('transactions')
    .delete()
    .eq('id', transactionID)
    .eq('user_id', user_id)
    .throwOnError();
};

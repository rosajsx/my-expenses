import { supabase } from '../supabase';

export const getTransactionById = async (user_id: string, transaction_id: number) => {
  return supabase
    .from('transactions')
    .select(
      `
       id,
        user_id,
        created_at,
        name,
        amount,
        type,
        installment,
        installment_qtd,
        date,
        updated_at,
        categories (
          id,
          name
        )
      `,
    )
    .eq('user_id', user_id)
    .eq('id', transaction_id)
    .single()
    .throwOnError();
};

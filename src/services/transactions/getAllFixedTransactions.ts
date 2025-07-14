import { supabase } from '../supabase';

export const getAllFixedTransactions = (user_id: string) => {
  const query = supabase
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
        is_fixed,
        installment_qtd,
        date,
        updated_at,
        categories (
          id,
          name
        )
        `,
    )
    .eq('is_fixed', true)
    .eq('user_id', user_id);

  return query.throwOnError();
};

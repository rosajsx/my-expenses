import { supabase } from '../supabase';

interface IFilter {
  month?: number;
  year?: string;
  transactionType?: number;
}

export const getAllTransactions = (user_id: string, filters?: IFilter) => {
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
        installment_qtd,
        date,
        updated_at,
        categories (
          id,
          name
        )
        `,
    )
    .eq('user_id', user_id);

  const year = filters?.year;

  if (filters?.month && filters?.year) {
    query.gte('date', `${year}-${filters.month + 1}-01`);
    query.lt('date', `${year}-${filters.month + 2}-01`);
  }

  if (filters?.month && !filters?.year) {
    query.gte('date', `2022-${filters.month + 1}-01`);
    query.lt('date', `${new Date().getFullYear()}-${filters.month + 2}-01`);
  }

  if (!filters?.month && filters?.year) {
    query.gte('date', `${filters?.year}-01-01`);
    query.lt('date', `${filters?.year}-12-31`);
  }

  if (filters?.transactionType) {
    query.eq('type', filters.transactionType);
  }

  return query.throwOnError();
};

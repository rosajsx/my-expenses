import { IFilter } from '@/store/slices/transactionsSlice';
import { supabase } from '../supabase';

export const getAllTransactions = (user_id: string, filters?: IFilter) => {
  const query = supabase.from('transactions').select().eq('user_id', user_id);

  const year = filters?.year || new Date().getFullYear();

  if (filters?.month) {
    query.gte('date', `${year}-${filters.month + 1}-01`);
    query.lt('date', `${year}-${filters.month + 2}-01`);
  }

  if (filters?.year && !filters?.month) {
    query.gte('date', `${year}-01-01`);
    query.lt('date', `${year + 1}-01-01`);
  }

  if (filters?.transactionType) {
    query.eq('type', filters.transactionType);
  }

  return query.throwOnError();
};

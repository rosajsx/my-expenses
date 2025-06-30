import { getAllTransactions } from '@/services/transactions/getAllTransactions';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/auth.hook';
import { useTransactionsStore } from './trasactions.store';

export const useTransactions = () => {
  const { pageState } = useTransactionsStore();
  const { session } = useAuth();

  const transactions = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      return getAllTransactions(session?.user?.id!);
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    transactions,
    pageState,
  };
};

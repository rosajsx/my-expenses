import { getMonthBalance } from '@/services/balances/getMonthBalance';
import { getAllFixedTransactions } from '@/services/transactions/getAllFixedTransactions';
import { getAllTransactions } from '@/services/transactions/getAllTransactions';
import { getAllMonthsOfYear } from '@/utils';
import { useIsFocused } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useHideTabBar } from '../useHideTabBar';

const months = getAllMonthsOfYear();

export const useBalanceDetails = () => {
  const { date } = useLocalSearchParams<{ date: string }>();

  const queryClient = useQueryClient();
  const isFocused = useIsFocused();

  const session: Session | undefined = queryClient.getQueryData(['session']);

  const slicedDate = date.split('-');

  const currentMonth = months.find((item) => {
    return item.value === slicedDate[1];
  });
  const currentYear = slicedDate[0] ? Number(slicedDate[0]) : new Date().getFullYear();

  useHideTabBar();

  const balanceResponse = useQuery({
    queryKey: ['balances', currentMonth?.value, currentYear],
    queryFn: async () => {
      return getMonthBalance(session?.user.id!, currentMonth?.id! + 1, currentYear);
    },
    subscribed: isFocused,
  });

  const transactionsResponse = useQuery({
    queryKey: ['transactions', currentMonth, currentYear],
    queryFn: async () => {
      const response = await getAllTransactions(session?.user?.id!, {
        year: currentYear.toString(),
        month: currentMonth?.id || 0,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });

  const fixedTransactions = useQuery({
    queryKey: ['fixed-transactions', session?.user?.id],
    queryFn: async () => {
      const response = await getAllFixedTransactions(session?.user?.id!);
      if (response.error) {
        throw response.error;
      }
      return response.data;
    },
  });

  const fixedTransactionsData =
    fixedTransactions.data
      ?.map((item) => {
        const date = new Date(`${currentYear}-${currentMonth?.id || 0 + 1}-01`);
        const createdAt = new Date(item.created_at);
        const formedDate = new Date(`${createdAt.getFullYear()}-${createdAt.getMonth()}-01`);
        if (date >= formedDate) {
          return item;
        } else {
          return null;
        }
      })
      .filter((item) => item !== null) || [];

  const isLoading =
    balanceResponse.isLoading ||
    transactionsResponse.isLoading ||
    fixedTransactions.isLoading ||
    fixedTransactions.isFetching;

  console.log('fixedTransactionsData', fixedTransactionsData);

  const data = [...(transactionsResponse.data || []), ...fixedTransactionsData];

  return {
    balanceResponse,
    transactionsResponse,
    isLoading,
    currentMonth,
    currentYear,
    data,
  };
};

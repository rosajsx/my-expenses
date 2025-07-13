import { getMonthBalanceDetails } from '@/services/balances/getMonthBalance';
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

  const currentMonth = months.find((item) => item.value === slicedDate[1])?.id || 0;
  const currentYear = slicedDate[0] ? Number(slicedDate[0]) : new Date().getFullYear();

  useHideTabBar();

  const balanceResponse = useQuery({
    queryKey: ['balances', currentMonth, currentYear],
    queryFn: async () => {
      return getMonthBalanceDetails(session?.user.id!, currentMonth, currentYear);
    },
    subscribed: isFocused,
  });

  const transactionsResponse = useQuery({
    queryKey: ['transactions', currentMonth, currentYear],
    queryFn: async () => {
      const response = await getAllTransactions(session?.user?.id!, {
        year: currentYear.toString(),
        month: currentMonth,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });

  return {
    balanceResponse,
    transactionsResponse,
  };
};

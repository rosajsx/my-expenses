import { getAllMonthBalances } from '@/services/balances/getMonthBalance';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useBalances = () => {
  const { session } = useAuth();

  const queryClient = useQueryClient();
  //queryClient.clear();

  const balancesResponse = useQuery({
    queryKey: ['all-balances'],
    queryFn: async () => {
      const data = await getAllMonthBalances(session?.user.id!);

      return data;
    },
  });

  return {
    balancesResponse,
  };
};

import { getAllMonthBalances } from '@/services/balances/getMonthBalance';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useBalances = () => {
  const { session } = useAuth();

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

import { getMonthBalance } from '@/services/balances/getMonthBalance';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

export const useBalances = () => {
  const { session } = useAuth();

  const response = useQuery({
    queryKey: ['balances'],
    queryFn: async () => {
      return getMonthBalance(session?.user.id!, currentMonth + 1, currentYear);
    },
    staleTime: 1000 * 60 * 24,
  });

  return {
    response,
  };
};

import { getMonthBalance } from '@/services/balances/getMonthBalance';
import { useIsFocused } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

export const useBalances = () => {
  const { session } = useAuth();
  const isFocused = useIsFocused();

  const response = useQuery({
    queryKey: ['balances'],
    queryFn: async () => {
      return getMonthBalance(session?.user.id!, currentMonth + 1, currentYear);
    },
    subscribed: isFocused,
  });

  return {
    response,
  };
};

import { getMonthBalance } from '@/services/balances/getMonthBalance';
import { useIsFocused } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

export const useBalances = () => {
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();

  const session: Session | undefined = queryClient.getQueryData(['session']);

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

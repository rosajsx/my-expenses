import { ScreenStateEnum } from '@/enums/screenStates';
import { getMonthBalance } from '@/services/balances/getMonthBalance';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/auth.hook';
import { useBalancesStore } from './balances.store';

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

export const useBalances = () => {
  const { state, setState } = useBalancesStore();
  const { session } = useAuth();

  const response = useQuery({
    queryKey: ['balances'],
    queryFn: async () => {
      setState(ScreenStateEnum.LOADING);
      try {
        const data = await getMonthBalance(session?.user.id!, currentMonth + 1, currentYear);

        return data;
      } catch (error) {
        console.error('Error fetching balances:', error);
        setState(ScreenStateEnum.ERROR);
      }
    },
  });

  return {
    state,
    response,
  };
};

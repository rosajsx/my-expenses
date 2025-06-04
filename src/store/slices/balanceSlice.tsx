import { ScreenStateEnum } from '@/enums/screenStates';
import { getMonthBalance } from '@/services/balances/getMonthBalance'; // Assuming this is a placeholder for future use
import { StateCreator } from 'zustand';

type BalanceInView = 'GENERAL' | 'MONTH';

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

export interface BalanceSlice {
  balanceState: keyof typeof ScreenStateEnum;
  balance: number;
  monthBalance: number;
  balanceInView: BalanceInView;
  getBalances: (user_id: string) => Promise<void>;
  toggleBalanceView: () => void;
}

export const createBalanceSlice: StateCreator<BalanceSlice, [], [], BalanceSlice> = (set) => ({
  balanceState: ScreenStateEnum.LOADING,
  balance: 0,
  monthBalance: 0,
  balanceInView: 'MONTH',
  getBalances: async (user_id) => {
    set((state) => ({ balanceState: ScreenStateEnum.LOADING }));
    try {
      const monthBalance = await getMonthBalance(user_id, currentMonth + 1, currentYear);
      set((state) => ({
        balance: 0,
        monthBalance: monthBalance,
        balanceState: ScreenStateEnum.DEFAULT,
      }));
    } catch (error) {
      console.log('error getting balance info', error);
      set((state) => ({
        balanceState: ScreenStateEnum.ERROR,
      }));
    }
  },
  toggleBalanceView: () => {
    set((state) => {
      return {
        balanceInView: state.balanceInView === 'GENERAL' ? 'MONTH' : 'GENERAL',
      };
    });
  },
});

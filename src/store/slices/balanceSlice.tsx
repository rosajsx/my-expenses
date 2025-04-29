import { getCacheAccountBalance } from '@/src/database/accountSummary/getCachedBalance';
import { getMonthBalance } from '@/src/database/accountSummary/getMonthBalance';
import { ScreenStateEnum } from '@/src/enums/screenStates';
import { SQLiteDatabase } from 'expo-sqlite';
import { StateCreator } from 'zustand';

type BalanceInView = 'GENERAL' | 'MONTH';

const currentMonth = new Date().getMonth();

export interface BalanceSlice {
  balanceState: keyof typeof ScreenStateEnum;
  balance: number;
  monthBalance: number;
  balanceInView: BalanceInView;
  getBalances: (database: SQLiteDatabase) => Promise<void>;
  toggleBalanceView: () => void;
}

export const createBalanceSlice: StateCreator<BalanceSlice, [], [], BalanceSlice> = (set) => ({
  balanceState: ScreenStateEnum.LOADING,
  balance: 0,
  monthBalance: 0,
  balanceInView: 'GENERAL',
  getBalances: async (database) => {
    set((state) => ({ balanceState: ScreenStateEnum.LOADING }));
    try {
      const balance = await getCacheAccountBalance(database);
      const monthBalance = await getMonthBalance(database, `${currentMonth + 1}`);
      set((state) => ({
        balance: balance,
        monthBalance: monthBalance?.total,
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

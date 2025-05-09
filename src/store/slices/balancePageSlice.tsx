import { BalanceType, getBalancePerMonth } from '@/database/balances/getBalancePerMonth';
import { ScreenStateEnum } from '@/enums/screenStates';
import { SQLiteDatabase } from 'expo-sqlite';
import { StateCreator } from 'zustand';

export interface BalancePageSlice {
  balancePage: {
    balances: BalanceType[];
    state: keyof typeof ScreenStateEnum;
    getBalances: (database: SQLiteDatabase) => Promise<void>;
  };
}

export const createBalancePageSlice: StateCreator<BalancePageSlice, [], [], BalancePageSlice> = (
  set,
) => ({
  balancePage: {
    balances: [],
    state: ScreenStateEnum.LOADING,
    getBalances: async (database) => {
      set((state) => ({ balancePage: { ...state.balancePage, state: ScreenStateEnum.LOADING } }));
      try {
        const data = await getBalancePerMonth(database);
        set((state) => ({
          balancePage: {
            ...state.balancePage,
            balances: data,
          },
        }));
      } catch (error) {
        console.log('Eror getting balances page', error);
        set((state) => ({ balancePage: { ...state.balancePage, state: ScreenStateEnum.ERROR } }));
      }
    },
  },
});

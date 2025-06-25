import { ScreenStateEnum } from '@/enums/screenStates';
import { StateCreator } from 'zustand';

export interface BalancePageSlice {
  balancePage: {
    balances: any[];
    filteredBalances: any[];
    state: keyof typeof ScreenStateEnum;
    clearFilters: () => void;
    getBalances: (database: any) => Promise<void>;
    getFilteredBalances: () => void;
    selectedYear: string | undefined;
    setSelectedYear: (value: string) => void;
    isSelectYearOpen: boolean;
    toggleSelectYearOpen: () => void;
    selectedItem?: any;
    setSelectedItem: (item: any) => void;
  };
}

export const createBalancePageSlice: StateCreator<BalancePageSlice, [], [], BalancePageSlice> = (
  set,
) => ({
  balancePage: {
    balances: [],
    filteredBalances: [],
    state: ScreenStateEnum.LOADING,
    isSelectYearOpen: false,
    selectedYear: undefined,
    selectedItem: undefined,
    setSelectedItem: (item) =>
      set((state) => ({
        ...state,
        balancePage: {
          ...state.balancePage,
          selectedItem: item,
        },
      })),
    getBalances: async (database) => {
      set((state) => ({
        balancePage: { ...state.balancePage, state: ScreenStateEnum.LOADING, balances: [] },
      }));
      try {
        // const data = await getBalancePerMonth(database);
        set((state) => ({
          balancePage: {
            ...state.balancePage,
            balances: [],
            filteredBalances: [],
            state: ScreenStateEnum.DEFAULT,
          },
        }));
      } catch (error) {
        console.log('Eror getting balances page', error);
        set((state) => ({
          balancePage: { ...state.balancePage, state: ScreenStateEnum.ERROR, balances: [] },
        }));
      }
    },
    toggleSelectYearOpen: () =>
      set((state) => ({
        ...state,
        balancePage: {
          ...state.balancePage,
          isSelectYearOpen: !state.balancePage.isSelectYearOpen,
        },
      })),
    setSelectedYear: (value: string) =>
      set((state) => ({ ...state, balancePage: { ...state.balancePage, selectedYear: value } })),
    getFilteredBalances: () => {
      set((state) => {
        const store = state.balancePage;
        const data = store.balances.filter((item) => item.month.includes(store.selectedYear!));
        return {
          ...state,
          balancePage: {
            ...state.balancePage,
            filteredBalances: data,
          },
        };
      });
    },
    clearFilters: () =>
      set((state) => ({
        ...state,
        balancePage: {
          ...state.balancePage,
          selectedYear: undefined,
          filteredBalances: state.balancePage.balances,
        },
      })),
  },
});

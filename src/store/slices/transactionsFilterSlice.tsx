import { create, StateCreator } from 'zustand';

type SelectedMonth = {
  id: number;
  value: string;
};

export interface TransactionFilterSlice {
  selectedYear: string | undefined;
  selectedMonth: SelectedMonth | undefined;
  transactionTypeFilter: number | undefined;
  isSelectYearModalOpen: boolean;
  isSelectMonthModalOpen: boolean;

  toggleTransactionTypeFiler: () => void;
  setSelectedYear: (value: string) => void;
  setSelectedMonth: (month: SelectedMonth) => void;

  handleOpenSelectYearModal: () => void;
  handleCloseSelectYearModal: () => void;
  handleOpenSelectMonthModal: () => void;
  handleCloseSelectMonthModal: () => void;

  resetTransactionFilters: () => void;
}

export const createTransactionsFilterSlice: StateCreator<
  TransactionFilterSlice,
  [],
  [],
  TransactionFilterSlice
> = (set) => ({
  selectedMonth: undefined,
  selectedYear: undefined,
  transactionTypeFilter: undefined,
  isSelectMonthModalOpen: false,
  isSelectYearModalOpen: false,

  toggleTransactionTypeFiler: () => {
    set((state) => {
      if (!state.transactionTypeFilter) {
        return {
          transactionTypeFilter: 1,
        };
      }

      if (state.transactionTypeFilter === 1) {
        return {
          transactionTypeFilter: 2,
        };
      }

      return {
        transactionTypeFilter: undefined,
      };
    });
  },
  setSelectedMonth: (month) => set(() => ({ selectedMonth: month })),
  setSelectedYear: (value) => set(() => ({ selectedYear: value })),

  handleOpenSelectYearModal: () => set(() => ({ isSelectYearModalOpen: true })),
  handleCloseSelectYearModal: () => set(() => ({ isSelectYearModalOpen: false })),
  handleOpenSelectMonthModal: () => set(() => ({ isSelectMonthModalOpen: true })),
  handleCloseSelectMonthModal: () => set(() => ({ isSelectMonthModalOpen: false })),

  resetTransactionFilters: () =>
    set(() => ({
      selectedMonth: undefined,
      selectedYear: undefined,
      transactionTypeFilter: undefined,
      isSelectMonthModalOpen: false,
      isSelectYearModalOpen: false,
    })),
});

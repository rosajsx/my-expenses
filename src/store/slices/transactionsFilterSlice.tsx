import { StateCreator } from 'zustand';

type SelectedMonth = {
  id: number;
  value: string;
};

export interface TransactionFilterSlice {
  selectedYear: string | undefined;
  selectedMonth: SelectedMonth | undefined;
  selectedTransactionType: number | undefined;
  isSelectYearModalOpen: boolean;
  isSelectMonthModalOpen: boolean;
  isTransactionTypeFilterOpen: boolean;

  setSelectedYear: (value: string) => void;
  setSelectedMonth: (month: SelectedMonth) => void;
  setTransactionTypeFilter: (value: number | undefined) => void;

  handleOpenSelectYearModal: () => void;
  handleCloseSelectYearModal: () => void;
  handleOpenSelectMonthModal: () => void;
  handleCloseSelectMonthModal: () => void;
  handleOpenTransactionTypeModal: () => void;
  handleCloseTransactionTypeModal: () => void;

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
  selectedTransactionType: undefined,

  isSelectMonthModalOpen: false,
  isSelectYearModalOpen: false,
  isTransactionTypeFilterOpen: false,

  setSelectedMonth: (month) => set(() => ({ selectedMonth: month })),
  setSelectedYear: (value) => set(() => ({ selectedYear: value })),
  setTransactionTypeFilter: (value) => set(() => ({ selectedTransactionType: value })),

  handleOpenSelectYearModal: () => set(() => ({ isSelectYearModalOpen: true })),
  handleCloseSelectYearModal: () => set(() => ({ isSelectYearModalOpen: false })),
  handleOpenSelectMonthModal: () => set(() => ({ isSelectMonthModalOpen: true })),
  handleCloseSelectMonthModal: () => set(() => ({ isSelectMonthModalOpen: false })),
  handleOpenTransactionTypeModal: () => set(() => ({ isTransactionTypeFilterOpen: true })),
  handleCloseTransactionTypeModal: () => set(() => ({ isTransactionTypeFilterOpen: false })),

  resetTransactionFilters: () =>
    set(() => ({
      selectedMonth: undefined,
      selectedYear: undefined,
      transactionTypeFilter: undefined,
      isSelectMonthModalOpen: false,
      isSelectYearModalOpen: false,
    })),
});

import { getAllMonthsOfYear } from '@/utils';
import { create } from 'zustand';
import { TransactionsStore } from './transactions.types';

const allMonths = getAllMonthsOfYear();
const monthValue = allMonths[new Date().getMonth()];
const currentYear = new Date().getFullYear();

export const useTransactionsStore = create<TransactionsStore>((set) => ({
  selectedMonth: monthValue,
  selectedYear: currentYear.toString(),
  selectedTransactionType: undefined,
  selectedCategory: undefined,

  isSelectMonthModalOpen: false,
  isSelectYearModalOpen: false,
  isTransactionTypeFilterOpen: false,
  isSelectCategoryModalOpen: false,

  setSelectedCategory: (value) => set(() => ({ selectedCategory: value })),
  setSelectedMonth: (month) => set(() => ({ selectedMonth: month })),
  setSelectedYear: (value) => set(() => ({ selectedYear: value })),
  setTransactionTypeFilter: (value) => set(() => ({ selectedTransactionType: value })),

  handleOpenSelectYearModal: () => set(() => ({ isSelectYearModalOpen: true })),
  handleCloseSelectYearModal: () => set(() => ({ isSelectYearModalOpen: false })),
  handleOpenSelectMonthModal: () => set(() => ({ isSelectMonthModalOpen: true })),
  handleCloseSelectMonthModal: () => set(() => ({ isSelectMonthModalOpen: false })),
  handleOpenTransactionTypeModal: () => set(() => ({ isTransactionTypeFilterOpen: true })),
  handleCloseTransactionTypeModal: () => set(() => ({ isTransactionTypeFilterOpen: false })),

  handleOpenSelectCategoryModal: () => set(() => ({ isSelectCategoryModalOpen: true })),
  handleCloseSelectCategoryModal: () => set(() => ({ isSelectCategoryModalOpen: false })),

  resetTransactionFilters: () =>
    set(() => ({
      selectedMonth: monthValue,
      selectedYear: undefined,
      selectedTransactionType: undefined,
      isSelectMonthModalOpen: false,
      isSelectYearModalOpen: false,
    })),
}));

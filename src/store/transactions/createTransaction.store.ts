import { create } from 'zustand';
import { CreateTransactionStore } from './transactions.types';

const initialData = {
  transactionName: '',
  transactionType: 1,
  selectedDate: new Date(),
  amount: 0,
  category: null,
  haveInstallment: false,
  installmentQtd: null,
  isDateModalOpen: false,
  isCategoryModalOpen: false,
  isInstallmentsModalOpen: false,
};

export const useCreateTransactionStore = create<CreateTransactionStore>((set) => ({
  ...initialData,

  setTransactionName: (value) => set({ transactionName: value }),
  setTransactionType: (value) => set({ transactionType: value }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setAmount: (value) => set({ amount: value }),
  setCategory: (value) => set({ category: value }),
  setHaveInstallment: (value) => set({ haveInstallment: value }),
  setInstallmentQtd: (value) => set({ installmentQtd: value }),
  setIsDateModalOpen: (value) => set({ isDateModalOpen: value }),
  setIsInstallmentsModalOpen: (value) => set({ isInstallmentsModalOpen: value }),
  setIsCategoryModalOpen: (value) => set({ isCategoryModalOpen: value }),

  resetStore: () => set({ ...initialData }),
}));

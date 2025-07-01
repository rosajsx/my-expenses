import { Database } from '../../../database.types';

export type ITransaction = Database['public']['Tables']['transactions']['Row'];

export type SelectedMonth = {
  id: number;
  value: string;
};

export interface TransactionsStore {
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

export interface CreateTransactionStore {
  transactionName: string;
  transactionType: number;
  selectedDate: Date;
  amount: number;
  category: string;
  haveInstallment: boolean;
  installmentQtd: string | null;
  isDateModalOpen: boolean;
  isInstallmentsModalOpen: boolean;

  setTransactionName: (value: string) => void;
  setTransactionType: (value: number) => void;
  setSelectedDate: (date: Date) => void;
  setAmount: (value: number) => void;
  setCategory: (value: string) => void;
  setHaveInstallment: (value: boolean) => void;
  setInstallmentQtd: (value: string | null) => void;
  setIsDateModalOpen: (value: boolean) => void;
  setIsInstallmentsModalOpen: (value: boolean) => void;
  resetStore: () => void;
}

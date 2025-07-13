import { Database } from '../../../database.types';

export type ITransaction = Database['public']['Tables']['transactions']['Row'];
export type ICategory = Database['public']['Tables']['categories']['Row'];

export interface TransactionComposed extends Omit<ITransaction, 'category_id'> {
  categories: ICategory | null;
}

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
  category: ICategory | null;
  haveInstallment: boolean;
  installmentQtd: string | null;
  isDateModalOpen: boolean;
  isInstallmentsModalOpen: boolean;
  isCategoryModalOpen: boolean;

  setTransactionName: (value: string) => void;
  setTransactionType: (value: number) => void;
  setSelectedDate: (date: Date) => void;
  setAmount: (value: number) => void;
  setCategory: (value: ICategory) => void;
  setHaveInstallment: (value: boolean) => void;
  setInstallmentQtd: (value: string | null) => void;
  setIsDateModalOpen: (value: boolean) => void;
  setIsInstallmentsModalOpen: (value: boolean) => void;
  setIsCategoryModalOpen: (value: boolean) => void;
  resetStore: () => void;
}

export interface UpdateTransactionStore {
  transactionName: string;
  transactionType: number;
  selectedDate: Date;
  amount: number;
  category: ICategory | null;
  haveInstallment: boolean;
  installmentQtd: string | null;
  isDateModalOpen: boolean;
  isInstallmentsModalOpen: boolean;
  isCategoryModalOpen: boolean;

  setTransactionName: (value: string) => void;
  setTransactionType: (value: number) => void;
  setSelectedDate: (date: Date) => void;
  setAmount: (value: number) => void;
  setCategory: (value: ICategory) => void;
  setHaveInstallment: (value: boolean) => void;
  setInstallmentQtd: (value: string | null) => void;
  setIsDateModalOpen: (value: boolean) => void;
  setIsInstallmentsModalOpen: (value: boolean) => void;
  setIsCategoryModalOpen: (value: boolean) => void;
  resetStore: () => void;
}

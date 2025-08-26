export interface ICategory {
  id: number;
  name: string;
}

export interface ITransaction {
  id: number;
  user_id: string;
  created_at: string;
  name: string;
  amount: number;
  type: number;
  installment: number | null;
  installment_qtd: number | null;
  category_id: number | null;
  is_fixed: boolean;
  date: string | null;
  updated_at: string;
}

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
  selectedCategory: ICategory | undefined;
  isSelectYearModalOpen: boolean;
  isSelectMonthModalOpen: boolean;
  isTransactionTypeFilterOpen: boolean;
  isSelectCategoryModalOpen: boolean;

  setSelectedCategory: (value: ICategory | undefined) => void;
  setSelectedYear: (value: string) => void;
  setSelectedMonth: (month: SelectedMonth) => void;
  setTransactionTypeFilter: (value: number | undefined) => void;

  handleOpenSelectYearModal: () => void;
  handleCloseSelectYearModal: () => void;
  handleOpenSelectMonthModal: () => void;
  handleCloseSelectMonthModal: () => void;
  handleOpenTransactionTypeModal: () => void;
  handleCloseTransactionTypeModal: () => void;

  handleOpenSelectCategoryModal: () => void;
  handleCloseSelectCategoryModal: () => void;

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
  isFixedExpense: boolean;

  setIsFixedExpense: (value: boolean) => void;
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
  isFixedExpense: boolean;
  setIsFixedExpense: (value: boolean) => void;

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

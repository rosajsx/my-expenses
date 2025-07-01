import { Database } from '../../../database.types';

export type ITransaction = Database['public']['Tables']['transactions']['Row'];

type SelectedMonth = {
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

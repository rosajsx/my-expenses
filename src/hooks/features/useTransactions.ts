import { ScreenStateEnum } from '@/enums/screenStates';
import { getAllTransactions } from '@/services/transactions/getAllTransactions';
import { useTransactionsStore } from '@/store/transactions/trasactions.store';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useTransactions = () => {
  const {
    pageState,
    setPageState,
    selectedMonth,
    selectedYear,
    selectedTransactionType,
    setSelectedMonth,
    setSelectedYear,
    setTransactionTypeFilter,
    isSelectMonthModalOpen,
    isSelectYearModalOpen,
    isTransactionTypeFilterOpen,

    handleCloseSelectMonthModal,
    handleCloseSelectYearModal,
    handleCloseTransactionTypeModal,
    handleOpenSelectMonthModal,
    handleOpenSelectYearModal,
    handleOpenTransactionTypeModal,
  } = useTransactionsStore();
  const { session } = useAuth();

  const queryKey = ['transactions', selectedMonth?.value];
  if (selectedYear) queryKey.push(selectedYear.toString());
  if (selectedTransactionType) queryKey.push(selectedTransactionType.toString());

  const transactions = useQuery({
    queryKey,
    queryFn: async () => {
      setPageState(ScreenStateEnum.LOADING);
      try {
        const response = await getAllTransactions(session?.user?.id!, {
          year: selectedYear ? Number(selectedYear) : undefined,
          month: selectedMonth?.id,
          transactionType: selectedTransactionType,
        });

        setPageState(ScreenStateEnum.SUCCESS);
        return response;
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setPageState(ScreenStateEnum.ERROR);
      }
    },

    staleTime: 1000 * 60 * 24,
  });

  return {
    transactions,
    pageState,
    selectedMonth,
    selectedYear,
    selectedTransactionType,
    handleCloseSelectMonthModal,
    handleCloseSelectYearModal,
    handleCloseTransactionTypeModal,
    handleOpenSelectMonthModal,
    handleOpenSelectYearModal,
    handleOpenTransactionTypeModal,
    setSelectedMonth,
    setSelectedYear,
    setTransactionTypeFilter,
    isSelectMonthModalOpen,
    isSelectYearModalOpen,
    isTransactionTypeFilterOpen,
  };
};

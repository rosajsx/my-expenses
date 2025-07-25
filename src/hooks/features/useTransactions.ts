import { getCategories } from '@/services/categories/getCategories';
import { getAllFixedTransactions } from '@/services/transactions/getAllFixedTransactions';
import { getAllTransactions } from '@/services/transactions/getAllTransactions';
import { useTransactionsStore } from '@/store/transactions/trasactions.store';
import { getAllMonthsOfYear } from '@/utils';
import { useIsFocused } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteTransactionById } from '../../services/transactions/deleteTransaction';

const months = getAllMonthsOfYear();
const currentMonth = months[new Date().getMonth()];
const currentYear = new Date().getFullYear();

export const useTransactions = () => {
  const {
    selectedMonth,
    selectedYear,
    selectedTransactionType,
    selectedCategory,
    setSelectedMonth,
    setSelectedYear,

    setTransactionTypeFilter,
    isSelectMonthModalOpen,
    isSelectYearModalOpen,
    isTransactionTypeFilterOpen,

    isSelectCategoryModalOpen,
    setSelectedCategory,
    handleCloseSelectCategoryModal,
    handleOpenSelectCategoryModal,
    handleCloseSelectMonthModal,
    handleCloseSelectYearModal,
    handleCloseTransactionTypeModal,
    handleOpenSelectMonthModal,
    handleOpenSelectYearModal,
    handleOpenTransactionTypeModal,
  } = useTransactionsStore();
  const isFocused = useIsFocused();
  const queryClient = useQueryClient();
  const session: Session | undefined = queryClient.getQueryData(['session']);

  const queryKey = ['transactions'];
  if (selectedMonth?.value) queryKey.push(selectedMonth.value);
  else queryKey.push('all-months');
  if (selectedYear) queryKey.push(selectedYear.toString());
  else {
    queryKey.push('all-years');
  }
  if (selectedTransactionType) queryKey.push(selectedTransactionType.toString());
  else {
    queryKey.push('all-types');
  }

  const transactions = useQuery({
    queryKey,
    queryFn: async () => {
      return getAllTransactions(session?.user?.id!, {
        year: selectedYear,
        month: selectedMonth?.id,
        transactionType: selectedTransactionType,
      });
    },
    subscribed: isFocused,
  });

  const fixedTransactions = useQuery({
    queryKey: ['fixed-transactions', session?.user?.id],
    queryFn: async () => {
      const response = await getAllFixedTransactions(session?.user?.id!);
      if (response.error) {
        throw response.error;
      }
      return response.data;
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (transactionId: number) => {
      return deleteTransactionById(session?.user?.id!, transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
        exact: true,
      });

      queryClient.invalidateQueries({ queryKey: ['balances'] });
    },
  });

  const categoriesResponse = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getCategories();
      if (response.error) {
        throw response.error;
      }
      return response.data;
    },
  });

  const data = transactions.data ? [...transactions.data.data] : [];
  const loading =
    transactions.isLoading ||
    transactions.isRefetching ||
    transactions.isPending ||
    fixedTransactions.isLoading ||
    fixedTransactions.isRefetching ||
    fixedTransactions.isPending;
  if (fixedTransactions?.data) {
    data.push(...fixedTransactions.data);
  }

  console.log('data', JSON.stringify(data, null, 2));
  console.log('fixed', JSON.stringify(fixedTransactions.data, null, 2));

  return {
    transactions,
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
    deleteTransactionMutation,
    currentMonth,
    currentYear,
    selectedCategory,
    setSelectedCategory,
    isSelectCategoryModalOpen,
    handleOpenSelectCategoryModal,
    handleCloseSelectCategoryModal,
    categoriesResponse,
    fixedTransactions,
    data,
    loading,
  };
};

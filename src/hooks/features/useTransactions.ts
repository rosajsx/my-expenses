import { getAllTransactions } from '@/services/transactions/getAllTransactions';
import { useTransactionsStore } from '@/store/transactions/trasactions.store';
import { useIsFocused } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useAuth } from './useAuth';

export const useTransactions = () => {
  const {
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
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();

  const queryKey = ['transactions', selectedMonth?.value];
  if (selectedYear) queryKey.push(selectedYear.toString());
  if (selectedTransactionType) queryKey.push(selectedTransactionType.toString());

  const transactions = useQuery({
    queryKey,
    queryFn: async () => {
      return getAllTransactions(session?.user?.id!, {
        year: selectedYear ? Number(selectedYear) : undefined,
        month: selectedMonth?.id,
        transactionType: selectedTransactionType,
      });
    },
    enabled: isFocused,
  });

  useFocusEffect(
    useCallback(() => {
      transactions.refetch();

      return () => {
        queryClient.removeQueries({
          queryKey,
        });
      };
    }, []),
  );

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
  };
};

import { getCategories } from '@/services/categories/getCategories';
import { getTransactionById } from '@/services/transactions/getTransactionById';
import { updateTransaction } from '@/services/transactions/updateTransaction';
import { useUpdateTransactionStore } from '@/store/transactions/updateTransaction.store';
import { Session } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export const useUpdateTransaction = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    amount,
    setAmount,
    selectedDate,
    setSelectedDate,
    transactionName,
    setTransactionName,
    transactionType,
    setTransactionType,
    haveInstallment,
    setHaveInstallment,
    installmentQtd,
    setInstallmentQtd,
    category,
    setCategory,
    isDateModalOpen,
    isCategoryModalOpen,
    isInstallmentsModalOpen,
    setIsCategoryModalOpen,
    setIsDateModalOpen,
    setIsInstallmentsModalOpen,
    isFixedExpense,
    setIsFixedExpense,
  } = useUpdateTransactionStore();
  const queryClient = useQueryClient();
  const session: Session | undefined = queryClient.getQueryData(['session']);

  const queryKey = ['transaction', id];
  const response = useQuery({
    queryKey,
    queryFn: async () => {
      const transactionResponse = await getTransactionById(session?.user?.id!, Number(id));

      return transactionResponse.data;
    },
  });

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getCategories();
      return response.data;
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async () => {
      return updateTransaction(session?.user?.id!, {
        name: transactionName,
        amount,
        id: Number(id),
        type: transactionType,
        date: selectedDate.toISOString(),
        category_id: category?.id!,
        installment_qtd: haveInstallment ? parseInt(installmentQtd || '0', 10) : null,
        is_fixed: isFixedExpense,
        created_at: response.data?.created_at,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      queryClient.invalidateQueries({ queryKey: ['transaction', id] });

      queryClient.invalidateQueries({
        queryKey: ['fixed-transactions'],
      });

      queryClient.invalidateQueries({
        queryKey: ['all-balances'],
      });
    },
    onError: (error) => {
      console.error('Error updating transaction:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a transação. Tente novamente mais tarde.');
    },
  });

  useEffect(() => {
    if (response.data?.name && !transactionName) setTransactionName(response.data?.name);
    if (response.data?.amount && !amount) setAmount(response.data?.amount);
    if (response.data?.date && selectedDate !== new Date(response?.data?.date))
      setSelectedDate(new Date(response.data?.date));
    if (response.data?.type && transactionType !== 1) setTransactionType(response.data?.type);
    if (response.data?.categories && !category) setCategory(response.data?.categories);

    if (response.data?.installment && response.data?.installment_qtd) {
      setInstallmentQtd(response.data?.installment_qtd.toString());
      setHaveInstallment(true);
    }
    setIsFixedExpense(response.data?.is_fixed || false);
  }, [response.data]);

  return {
    response,
    transactionName,
    transactionType,
    selectedDate,
    amount,
    category,
    haveInstallment,
    installmentQtd,
    isDateModalOpen,
    isInstallmentsModalOpen,
    setTransactionName,
    setTransactionType,
    setSelectedDate,
    setAmount,
    setCategory,
    setHaveInstallment,
    setInstallmentQtd,
    setIsDateModalOpen,
    setIsInstallmentsModalOpen,
    updateTransactionMutation,
    categories,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isFixedExpense,
    setIsFixedExpense,
  };
};

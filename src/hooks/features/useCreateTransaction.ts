import { getCategories } from '@/services/categories/getCategories';
import { createTransaction } from '@/services/transactions/createTransaction';
import { useCreateTransactionStore } from '@/store/transactions/createTransaction.store';
import { Session } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { Alert, TextInput } from 'react-native';

const incomeTypeOptions = [
  {
    label: 'Entrada',
    value: 1,
  },
  {
    label: 'Saída',
    value: 2,
  },
];

export const useCreateTransaction = () => {
  const {
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
    resetStore,
    setIsDateModalOpen,
    setIsInstallmentsModalOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isFixedExpense,
    setIsFixedExpense,
  } = useCreateTransactionStore();

  const currencyValueRef = useRef<TextInput>(null);
  const categoryValueRef = useRef<TextInput>(null);
  const queryClient = useQueryClient();

  const session: Session | undefined = queryClient.getQueryData(['session']);

  const createTransactionMutation = useMutation({
    mutationFn: async () => {
      return createTransaction(session?.user?.id!, {
        name: transactionName,
        amount,
        installment: haveInstallment ? 1 : null,
        installment_qtd: haveInstallment && installmentQtd ? Number(installmentQtd) : null,
        type: transactionType!,
        date: selectedDate.toISOString(),
        category_id: category?.id!,
        is_fixed: isFixedExpense,
      });
    },
    onError: (error) => {
      console.log('ERRO', error);
      Alert.alert('Ocorreu um erro inesperado ao criar a transação!', error?.message || '', [
        {
          text: 'OK',
        },
      ]);
    },
    onSuccess: () => {
      resetStore();
      queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
      queryClient.invalidateQueries({
        queryKey: ['fixed-transactions'],
      });
      queryClient.invalidateQueries({
        queryKey: ['balances'],
      });
      queryClient.invalidateQueries({
        queryKey: ['all-balances'],
      });
    },
  });

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getCategories();
      return response.data;
    },
  });

  const isCreateButtonDisabled = !transactionName || amount === 0 || !category;

  return {
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
    currencyValueRef,
    categoryValueRef,
    createTransactionMutation,
    incomeTypeOptions,
    resetStore,
    isCreateButtonDisabled,
    setIsDateModalOpen,
    setIsInstallmentsModalOpen,
    categories,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isFixedExpense,
    setIsFixedExpense,
  };
};

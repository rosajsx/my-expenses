import { createTransaction } from '@/services/transactions/createTransaction';
import { useCreateTransactionStore } from '@/store/transactions/createTransaction.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { Alert, TextInput } from 'react-native';
import { useAuth } from './useAuth';

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
  } = useCreateTransactionStore();

  const { session } = useAuth();

  const currencyValueRef = useRef<TextInput>(null);
  const categoryValueRef = useRef<TextInput>(null);
  const queryClient = useQueryClient();

  const createTransactionMutation = useMutation({
    mutationFn: async () => {
      return createTransaction(session?.user?.id!, {
        name: transactionName,
        amount,
        installment: haveInstallment ? 1 : null,
        installment_qtd: haveInstallment && installmentQtd ? Number(installmentQtd) : null,
        type: transactionType!,
        date: selectedDate.toISOString(),
        category,
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
        queryKey: ['balances'],
      });
    },
  });

  const isCreateButtonDisabled = !transactionName || amount === 0;

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
  };
};

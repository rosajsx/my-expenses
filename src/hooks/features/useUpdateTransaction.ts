import { getTransactionById } from '@/services/transactions/getTransactionById';
import { updateTransaction } from '@/services/transactions/updateTransaction';
import { Session } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export const useUpdateTransaction = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const session: Session | undefined = queryClient.getQueryData(['session']);

  const queryKey = ['transaction', id];
  const response = useQuery({
    queryKey,
    queryFn: async () => {
      const transactionResponse = await getTransactionById(session?.user?.id!, Number(id));
      const data = transactionResponse.data;
      if (data?.amount) setAmount(data?.amount);
      if (data?.date) setSelectedDate(new Date(data?.date));
      if (data?.type) setTransactionType(data?.type);
      if (data?.category) setCategory(data?.category);

      if (data?.installment && data?.installment_qtd) {
        setInstallmentQtd(data?.installment_qtd.toString());
        setHaveInstallment(true);
      }

      return transactionResponse.data;
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
        category,
        installment_qtd: haveInstallment ? parseInt(installmentQtd || '0', 10) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      queryClient.invalidateQueries({ queryKey: ['transaction', id] });
    },
  });

  const [transactionName, setTransactionName] = useState(response?.data?.name || '');
  const [transactionType, setTransactionType] = useState<number>(response?.data?.type || 1);
  const [selectedDate, setSelectedDate] = useState(
    response?.data?.date ? new Date(response?.data?.date) : new Date(),
  );
  const [amount, setAmount] = useState(response?.data?.amount || 0);
  const [category, setCategory] = useState(response?.data?.category || '');
  const [haveInstallment, setHaveInstallment] = useState<boolean>(
    !!response?.data?.installment && !!response?.data?.installment_qtd,
  );
  const [installmentQtd, setInstallmentQtd] = useState<string | null>(
    response?.data?.installment_qtd?.toString() || null,
  );
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isInstallmentsModalOpen, setIsInstallmentsModalOpen] = useState(false);

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
  };
};

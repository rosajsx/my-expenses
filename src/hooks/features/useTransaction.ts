import { deleteTransactionById } from '@/services/transactions/deleteTransaction';
import { getTransactionById } from '@/services/transactions/getTransactionById';
import { Session } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

export const useTransaction = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const queryClient = useQueryClient();

  const session: Session | undefined = queryClient.getQueryData(['session']);

  const key = ['transaction', id];

  const deleteTransactionMutation = useMutation({
    mutationFn: async () => {
      return deleteTransactionById(session?.user?.id!, Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: key,
        exact: true,
        refetchType: 'none',
      });

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    },
    retry: 3,
  });

  const response = useQuery({
    queryKey: key,
    queryFn: async () => {
      const balanceResponse = await getTransactionById(session?.user?.id!, Number(id));

      return balanceResponse.data;
    },
  });

  return {
    response,
    deleteTransactionMutation,
  };
};

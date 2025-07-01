import { getTransactionById } from '@/services/transactions/getTransactionById';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from './useAuth';

export const useTransaction = () => {
  const { session } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const response = useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      const balanceResponse = await getTransactionById(session?.user?.id!, Number(id));

      return balanceResponse.data;
    },
  });

  return {
    response,
  };
};

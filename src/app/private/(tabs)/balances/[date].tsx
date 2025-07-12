import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Typography } from '@/components/Typography';
import { useBalanceDetails } from '@/hooks/features/useBalanceDetails';
import { formatCurrency } from '@/utils';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { View } from 'react-native';

export default function BalanceDetail() {
  const { balanceResponse, transactionsResponse } = useBalanceDetails();

  return (
    <Container>
      <View>
        <Button variant="ghost" onPress={router.back}>
          <ArrowLeft />
        </Button>
      </View>
      <Typography>Total {formatCurrency(balanceResponse?.data?.total || 0)}</Typography>
      <Typography>Entradas {formatCurrency(balanceResponse?.data?.income || 0)}</Typography>
      <Typography>Saidas {formatCurrency(balanceResponse?.data?.outcome || 0)}</Typography>

      {transactionsResponse.data?.map((transaction) => {
        return (
          <Typography key={transaction.id}>
            {transaction.name} - {transaction.amount}
          </Typography>
        );
      })}
    </Container>
  );
}

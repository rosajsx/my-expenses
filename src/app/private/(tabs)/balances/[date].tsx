import { Container } from '@/components/Container';
import { PageHeader } from '@/components/Header';
import { BalanceHeader } from '@/components/Header/BalanceHeader';
import { Loading } from '@/components/Loading';
import { Transactions } from '@/components/Transactions';
import { Typography } from '@/components/Typography';
import { useBalanceDetails } from '@/hooks/features/useBalanceDetails';
import { StyleSheet, View } from 'react-native';

export default function BalanceDetail() {
  const { balanceResponse, isLoading, currentMonth, currentYear, data } = useBalanceDetails();

  return (
    <Container style={styles.content}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Loading />
        </View>
      ) : (
        <>
          <PageHeader actionText="" />
          <BalanceHeader
            month={currentMonth?.value!}
            year={currentYear}
            response={balanceResponse}
            filters={false}
          />

          <View style={styles.transactionContainer}>
            <Typography variant="body/lg" style={styles.transactionsText}>
              Transações
            </Typography>

            <Transactions data={data} />
          </View>
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionContainer: {
    gap: 2,
  },
  transactionsText: {
    paddingVertical: 8,
  },
});

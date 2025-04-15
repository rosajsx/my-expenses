import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';

import { Container } from '../components/Container';
import { Typography } from '../components/Typography';
import { useDatabase } from '../hooks/useDatabase';
import { useEffect, useState } from 'react';
import { Transaction } from '../database/types';
import { getAllTransactions } from '../database/transactions/getAllTransactions';
import { theme } from '../styles/theme';

import { TransactionCard } from '../components/transactionCard';
import { getCacheAccountBalance } from '../database/accountSummary/getCachedBalance';
import { formatCurrency } from '../utils';
import { createTransaction } from '../database/transactions/createTransaction';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';
import { Plus, RotateCw } from 'lucide-react-native';
import { router } from 'expo-router';

export default function Index() {
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [haveErrorOnTransactions, setHaveErrorOnTransactions] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [haveErrorOnBalance, setHaveErrorOnBalance] = useState(false);

  const [data, setData] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const { database } = useDatabase();

  const getTransactions = () => {
    if (haveErrorOnTransactions) setHaveErrorOnTransactions(false);
    setIsLoadingTransactions(true);
    getAllTransactions(database)
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.log('Error on getting all transactions info', error);
        setHaveErrorOnTransactions(true);
      })
      .finally(() => {
        setIsLoadingTransactions(false);
      });
  };

  const getBalance = () => {
    if (haveErrorOnBalance) setHaveErrorOnBalance(false);

    setIsLoadingBalance(true);
    getCacheAccountBalance(database)
      .then((response) => {
        setBalance(response);
      })
      .catch((error) => {
        console.log('Error on getting balance info', error);
        setHaveErrorOnBalance(true);
      })
      .finally(() => {
        setIsLoadingBalance(false);
      });
  };

  useEffect(() => {
    getTransactions();
    getBalance();
  }, []);

  // database.runAsync('DROP TABLE transactions');
  // database.runAsync('DROP TABLE account_summary');
  // database.runAsync('DROP TABLE balance_history');
  // database.execAsync(`PRAGMA user_version = ${0}`);

  return (
    <Container style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.balanceHeader}>
          <Typography variant="subtitle">Saldo total: </Typography>

          {isLoadingBalance && <Loading size="sm" />}
          {!isLoadingBalance && haveErrorOnBalance && (
            <Button Icon={RotateCw} variant="secondary" onPress={getBalance} />
          )}
          {!isLoadingBalance && !haveErrorOnBalance && (
            <Typography variant="subtitle" color={balance < 0 ? 'error' : 'textPrimary'}>
              {formatCurrency(balance)}
            </Typography>
          )}
        </View>
        <View style={styles.subHeader}>
          <Button
            Icon={Plus}
            onPress={() => router.navigate('/transactions/create')}
            title="Nova Transação"
            style={styles.addButton}
            variant="secondary"
          />
        </View>
      </View>
      <FlatList
        data={data}
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(list) => <TransactionCard transaction={list.item} />}
        ListHeaderComponent={<Typography variant="subtitle">Extrato</Typography>}
        ListEmptyComponent={
          <>
            {isLoadingTransactions && (
              <View style={styles.emptyLoading}>
                <Loading />
              </View>
            )}

            {!isLoadingTransactions && haveErrorOnTransactions && (
              <View style={styles.error}>
                <LottieView
                  autoPlay
                  style={theme.sizes.errorTransation}
                  source={require('../../assets/animations/error.json')}
                  loop={false}
                />
                <Typography variant="section" style={styles.errorText}>
                  Ocorreu um erro inesperado, por favor, tente novamente.
                </Typography>

                <Button title="Recarregar" onPress={getTransactions} />
              </View>
            )}

            {!isLoadingTransactions && !haveErrorOnTransactions && (
              <View style={styles.empty}>
                <LottieView
                  autoPlay
                  style={theme.sizes.emptyTransaction}
                  source={require('../../assets/animations/empty.json')}
                  loop={false}
                />
                <Typography variant="section">Nenhuma despesa encontrada.</Typography>
              </View>
            )}
          </>
        }
        ListHeaderComponentStyle={styles.header}
        stickyHeaderIndices={[0]}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        getItemLayout={(data, index) => ({
          length: theme.sizes.card,
          offset: theme.sizes.card * index,
          index,
        })}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  header: {
    backgroundColor: theme.colors.background,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  errorText: {
    textAlign: 'center',
  },
  list: {
    height: '100%',
    marginTop: theme.spacing.xl,
  },
  contentContainer: {
    gap: theme.spacing.lg,
  },
  subHeader: {},
  addButton: {
    flexDirection: 'row',
    width: 180,
  },
  headerContainer: {
    gap: theme.spacing.lg,
  },
});

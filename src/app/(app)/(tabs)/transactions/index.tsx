import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Container } from '@/components/Container';
import { useDatabase } from '@/hooks/useDatabase';
import { theme } from '@/styles/theme';
import { useEffect, useLayoutEffect, useState } from 'react';

import { BalanceHeader } from '@/components/BalanceHeader';
import { syncTransactions } from '@/database/transactions/syncTransactions';
import { useBoundStore } from '@/store';
import { colors } from '@/styles/colors';
import { formatCurrency, formatDate } from '@/utils';
import * as Network from 'expo-network';
import { router, useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useShallow } from 'zustand/react/shallow';

let isFirstRender = true;

export default function Index() {
  const { transactions, getTransactions, transactionsState } = useBoundStore(
    useShallow((state) => ({
      transactions: state.transactions,
      getTransactions: state.getTransactions,
      transactionsState: state.transactionsState,
    })),
  );

  const { isConnected } = Network.useNetworkState();

  const getBalances = useBoundStore((state) => state.getBalances);

  const { selectedMonth, selectedYear, resetFilters, selectedTransactionType } = useBoundStore(
    useShallow((state) => ({
      selectedYear: state.selectedYear,
      selectedMonth: state.selectedMonth,
      selectedTransactionType: state.selectedTransactionType,
      resetFilters: state.resetTransactionFilters,
    })),
  );

  const { update } = useLocalSearchParams<{ update?: string }>();

  const [syncTimes, setSyncTimes] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const { database } = useDatabase();

  const canSync = transactions.some((transaction) => transaction.pendingSync === 1);

  const handleGetTransactions = () => {
    const filters = {
      month: selectedMonth?.id,
      year: selectedYear ? Number(selectedYear) : undefined,
      transactionType: selectedTransactionType,
    };

    getTransactions(database, filters);
  };

  const handleGetBalances = () => {
    getBalances(database);
  };

  const updateData = () => {
    //handleGetTransactions();
    handleGetBalances();
  };

  useEffect(() => {
    updateData();
    resetFilters();
  }, []);

  useEffect(() => {
    handleGetTransactions();
  }, [selectedMonth?.value, selectedYear, selectedTransactionType]);

  // useEffect(() => {
  //   if (update === 'true') {
  //     updateData();
  //     resetFilters();
  //   }
  // }, [update]);

  useLayoutEffect(() => {
    if (isConnected) {
      (async () => {
        setIsSyncing(true);
        await syncTransactions();
        if (!isFirstRender) {
          updateData();
        }
        setIsSyncing(false);
        isFirstRender = false;
      })();
    }
  }, [syncTimes]);

  return (
    <>
      <Container style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Transações</Text>
            <TouchableOpacity onPress={() => router.navigate('/(app)/(tabs)/transactions/create')}>
              <Plus color={colors.primary} size={28} />
            </TouchableOpacity>
          </View>

          <BalanceHeader />
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={transactions.filter((transaction) => transaction.deleted === 0)}
            bounces={false}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <Pressable style={styles.transactionCard}>
                <View style={styles.transactionContent}>
                  <Text style={styles.transactionName}>{item.name}</Text>
                  <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    item.type === 1 ? styles.transactionAmountPlus : styles.transactionAmountMinus,
                  ]}>
                  {item.type !== 1 && '-'} {formatCurrency(item.amount)}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    backgroundColor: theme.colors.background,
  },
  listContainer: {},

  contentContainer: {
    gap: theme.spacing.md,
  },

  separator: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: colors.separator,
  },

  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  transactionContent: {
    gap: 4,
  },
  transactionName: {
    fontFamily: 'Inter_500Medium',
    fontWeight: 500,
    fontSize: 18,
  },
  transactionDate: {
    fontFamily: 'Inter_400Regular',
    fontWeight: 400,
    fontSize: 14,
  },
  transactionAmount: {
    fontFamily: 'Inter_500Medium',
    fontWeight: 500,
    fontSize: 18,
  },
  transactionAmountPlus: {
    color: colors.text,
  },
  transactionAmountMinus: {
    color: colors.red,
  },

  content: {
    gap: 16,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontWeight: 700,
    fontSize: 24,
  },
});

import { FlatList, StyleSheet, View } from 'react-native';

import { Container } from '@/components/Container';
import { useDatabase } from '@/hooks/useDatabase';
import { theme } from '@/styles/theme';
import { useEffect, useLayoutEffect, useState } from 'react';

import { BalanceHeader } from '@/components/BalanceHeader';
import { Header } from '@/components/Header';
import { EmptyComponent } from '@/components/TransactionList/EmptyComponent';
import { SelectMonthModal } from '@/components/TransactionList/SelectMonthModal';
import { SelectYearModal } from '@/components/TransactionList/SelectYearModal';
import { TransactionCard } from '@/components/TransactionList/transactionCard';
import { TransactionListHeader } from '@/components/TransactionList/TransactionListHeader';
import { syncTransactions } from '@/database/transactions/syncTransactions';
import { useBoundStore } from '@/store';
import * as Network from 'expo-network';
import { useLocalSearchParams } from 'expo-router';
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

  const { selectedMonth, selectedYear, resetFilters, transactionTypeFilter } = useBoundStore(
    useShallow((state) => ({
      selectedYear: state.selectedYear,
      selectedMonth: state.selectedMonth,
      transactionTypeFilter: state.transactionTypeFilter,
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
      transactionType: transactionTypeFilter,
    };

    getTransactions(database, filters);
  };

  const handleGetBalances = () => {
    getBalances(database);
  };

  const updateData = () => {
    handleGetTransactions();
    handleGetBalances();
  };

  useEffect(() => {
    updateData();
    resetFilters();
  }, []);

  useEffect(() => {
    if (update === 'true') {
      updateData();
      resetFilters();
    }
  }, [update]);

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
        <Header />
        <BalanceHeader
          db={database}
          onPressSync={() => setSyncTimes((prevState) => prevState + 1)}
          isSyncing={isSyncing}
          canSync={canSync}
        />
        <View style={styles.listContainer}>
          <FlatList
            data={transactions.filter((transaction) => transaction.deleted === 0)}
            bounces={false}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={(list) => <TransactionCard transaction={list.item} />}
            ListHeaderComponent={<TransactionListHeader onFilter={handleGetTransactions} />}
            ListEmptyComponent={
              <EmptyComponent
                transactionsState={transactionsState}
                handleGetTransactions={handleGetTransactions}
              />
            }
            ListHeaderComponentStyle={styles.header}
            stickyHeaderIndices={[0]}
            contentContainerStyle={styles.contentContainer}
            getItemLayout={(data, index) => ({
              length: theme.sizes.card,
              offset: theme.sizes.card * index,
              index,
            })}
          />
        </View>
      </Container>
      <SelectYearModal />
      <SelectMonthModal />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    gap: theme.spacing.md,
  },
  header: {
    backgroundColor: theme.colors.background,
  },
  listContainer: { flex: 1, paddingBottom: theme.spacing.xxl * 2 },

  contentContainer: {
    gap: theme.spacing.md,
  },
});

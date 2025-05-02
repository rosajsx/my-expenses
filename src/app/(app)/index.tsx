import { FlatList, StyleSheet } from 'react-native';

import { Container } from '@/components/Container';
import { useDatabase } from '@/hooks/useDatabase';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { theme } from '@/styles/theme';

import { TransactionCard } from '@/components/TransactionList/transactionCard';
import { useFocusEffect } from 'expo-router';
import { useBoundStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { TransactionListHeader } from '@/components/TransactionList/TransactionListHeader';
import { BalanceHeader } from '@/components/BalanceHeader';
import { EmptyComponent } from '@/components/TransactionList/EmptyComponent';
import { SelectYearModal } from '@/components/TransactionList/SelectYearModal';
import { SelectMonthModal } from '@/components/TransactionList/SelectMonthModal';
import { syncTransactions } from '@/database/transactions/syncTransactions';
import * as Network from 'expo-network';

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

  useFocusEffect(
    useCallback(() => {
      updateData();
      resetFilters();
    }, []),
  );

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

  // database.runAsync('DROP TABLE transactions');
  // database.runAsync('DROP TABLE account_summary');
  // database.runAsync('DROP TABLE balance_history');
  // database.execAsync(`PRAGMA user_version = ${0}`);
  return (
    <Container style={styles.container}>
      <BalanceHeader
        db={database}
        onPressSync={() => setSyncTimes((prevState) => prevState + 1)}
        isSyncing={isSyncing}
        canSync={canSync}
      />

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
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        getItemLayout={(data, index) => ({
          length: theme.sizes.card,
          offset: theme.sizes.card * index,
          index,
        })}
      />
      <SelectYearModal />
      <SelectMonthModal />
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

  list: {
    height: '100%',
    marginTop: theme.spacing.xl,
  },
  contentContainer: {
    gap: theme.spacing.lg,
  },
});

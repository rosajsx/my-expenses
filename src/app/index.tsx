import { FlatList, StyleSheet } from 'react-native';

import { Container } from '../components/Container';
import { useDatabase } from '../hooks/useDatabase';
import { useCallback, useMemo } from 'react';
import { theme } from '../styles/theme';

import { TransactionCard } from '../components/TransactionList/transactionCard';
import { useFocusEffect } from 'expo-router';
import { useBoundStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { TransactionListHeader } from '../components/TransactionList/TransactionListHeader';
import { BalanceHeader } from '../components/BalanceHeader';
import { EmptyComponent } from '../components/TransactionList/EmptyComponent';
import { SelectYearModal } from '../components/TransactionList/SelectYearModal';
import { SelectMonthModal } from '../components/TransactionList/SelectMonthModal';

export default function Index() {
  const { transactions, getTransactions, transactionsState } = useBoundStore(
    useShallow((state) => ({
      transactions: state.transactions,
      getTransactions: state.getTransactions,
      transactionsState: state.transactionsState,
    })),
  );

  const getBalances = useBoundStore((state) => state.getBalances);

  const { selectedMonth, selectedYear, resetFilters, transactionTypeFilter } = useBoundStore(
    useShallow((state) => ({
      selectedYear: state.selectedYear,
      selectedMonth: state.selectedMonth,
      transactionTypeFilter: state.transactionTypeFilter,
      resetFilters: state.resetTransactionFilters,
    })),
  );

  const { database } = useDatabase();

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

  // database.runAsync('DROP TABLE transactions');
  // database.runAsync('DROP TABLE account_summary');
  // database.runAsync('DROP TABLE balance_history');
  // database.execAsync(`PRAGMA user_version = ${0}`);

  console.log(transactions.length);

  return (
    <Container style={styles.container}>
      <BalanceHeader db={database} />

      <FlatList
        data={transactions.filter((transaction) => {
          console.log('transaction', transaction.deleted);
          return transaction.deleted === 0;
        })}
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={(list) => (
          <TransactionCard transaction={list.item} database={database} refetch={updateData} />
        )}
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

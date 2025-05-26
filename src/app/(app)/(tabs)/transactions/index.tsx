import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Container } from '@/components/Container';
import { useDatabase } from '@/hooks/useDatabase';
import { theme } from '@/styles/theme';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import { BalanceHeader } from '@/components/BalanceHeader';
import { SelectMonthModal } from '@/components/Sheets/SelectMonthModal';
import { TransactionTypeModal } from '@/components/Sheets/SelectTransactionType';
import { SelectYearModal } from '@/components/Sheets/SelectYearModal';
import { deleteTransaction } from '@/database/transactions/deleteTransaction';
import { syncTransactions } from '@/database/transactions/syncTransactions';
import { Transaction } from '@/database/types';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { useBoundStore } from '@/store';
import { colors } from '@/styles/colors';
import { formatCurrency, formatDate } from '@/utils';
import * as Network from 'expo-network';
import { router, useFocusEffect } from 'expo-router';
import { Plus, Trash } from 'lucide-react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
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

  const [syncTimes, setSyncTimes] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const { database } = useDatabase();

  const canSync = transactions.some((transaction) => transaction.pendingSync === 1);

  const { bottomSheetRef, closeSheet, openSheet, renderBackdrop, sheetIndex, updateSheetIndex } =
    useBottomSheet({});

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

  async function handleDelete(transaction: Transaction) {
    try {
      await deleteTransaction(database, transaction!);

      Alert.alert('Transação deletada com sucesso!');
      handleGetTransactions();
      handleGetBalances();
    } catch (error) {
      console.log(error);
      Alert.alert('Ocorreu um erro inesperado', JSON.stringify(error));
    }
  }

  function confirmDelete(transaction: Transaction) {
    Alert.alert(`Tem certeza que deseja apagar esta transação: ${transaction?.name} `, '', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Apagar',
        onPress: () => handleDelete(transaction),
        style: 'destructive',
      },
    ]);
  }

  const RightAction = (
    prog: SharedValue<number>,
    drag: SharedValue<number>,
    transaction: Transaction,
  ) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 80 }],
      };
    });
    return (
      <Reanimated.View style={[styleAnimation, styles.rightAction]}>
        <TouchableOpacity style={styles.rightActionBtn} onPress={() => confirmDelete(transaction)}>
          <Trash color={colors.backgroundWhite} size={24} />
          <Text style={styles.rightActionText}>Apagar</Text>
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  useEffect(() => {
    updateData();
    resetFilters();
  }, []);

  useEffect(() => {
    if (selectedMonth?.value || selectedYear || selectedTransactionType) {
      handleGetTransactions();
    }
  }, [selectedMonth?.value, selectedYear, selectedTransactionType]);

  useFocusEffect(
    useCallback(() => {
      handleGetTransactions();
      handleGetBalances();
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

  return (
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
            <ReanimatedSwipeable
              friction={2}
              enableTrackpadTwoFingerGesture
              rightThreshold={40}
              renderRightActions={(prag, drag) => RightAction(prag, drag, item)}>
              <Pressable
                style={styles.transactionCard}
                onPress={() => router.push(`/transactions/${item.id}`)}>
                <View style={styles.transactionContent}>
                  <Text style={styles.transactionName}>
                    {item.name}{' '}
                    {item.installment &&
                      item.installment_qtd &&
                      `${item.installment}/${item.installment_qtd}`}
                  </Text>
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
            </ReanimatedSwipeable>
          )}
        />
      </View>

      <SelectMonthModal />
      <SelectYearModal />
      <TransactionTypeModal />
    </Container>
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
  rightAction: {
    width: 80,
    height: '100%',
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  rightActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  rightActionText: {
    color: colors.white,
    fontFamily: 'Inter_500Medium',
    fontWeight: 500,
    fontSize: 14,
  },

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
    paddingRight: 4,
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

import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Container } from '@/components/Container';
import { useDatabase } from '@/hooks/useDatabase';
import { theme } from '@/styles/theme';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { BalanceHeader } from '@/components/Header/BalanceHeader';
import { Separator } from '@/components/Separator';
import { SelectMonthModal } from '@/components/Sheets/SelectMonthModal';
import { TransactionTypeModal } from '@/components/Sheets/SelectTransactionType';
import { SelectYearModal } from '@/components/Sheets/SelectYearModal';
import { Typography } from '@/components/Typography';
import { deleteTransaction } from '@/database/transactions/deleteTransaction';
import { Transaction } from '@/database/types';
import { useBoundStore } from '@/store';
import { colors } from '@/styles/colors';
import { formatCurrency, formatDate } from '@/utils';
import { router, useFocusEffect } from 'expo-router';
import { Pen, Plus, Trash } from 'lucide-react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';

export default function Index() {
  const { transactions, getTransactions, transactionsState } = useBoundStore(
    useShallow((state) => ({
      transactions: state.transactions,
      getTransactions: state.getTransactions,
      transactionsState: state.transactionsState,
    })),
  );

  // const { isConnected } = Network.useNetworkState();

  const getBalances = useBoundStore((state) => state.getBalances);
  const session = useBoundStore((state) => state.session);

  const { selectedMonth, selectedYear, resetFilters, selectedTransactionType } = useBoundStore(
    useShallow((state) => ({
      selectedYear: state.selectedYear,
      selectedMonth: state.selectedMonth,
      selectedTransactionType: state.selectedTransactionType,
      resetFilters: state.resetTransactionFilters,
    })),
  );

  const [isSyncing, setIsSyncing] = useState(false);

  const { database } = useDatabase();

  const handleGetTransactions = () => {
    const filters = {
      month: selectedMonth?.id,
      year: selectedYear ? Number(selectedYear) : undefined,
      transactionType: selectedTransactionType,
    };

    getTransactions(session?.user?.id!, filters);
  };

  const handleGetBalances = () => {
    getBalances(session?.user?.id!);
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

  const LeftAction = (
    prog: SharedValue<number>,
    drag: SharedValue<number>,
    transaction: Transaction,
  ) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value - 82 }],
      };
    });
    return (
      <Reanimated.View style={[styleAnimation, styles.leftAction]}>
        <TouchableOpacity
          style={styles.rightActionBtn}
          onPress={() => router.navigate(`/private/transactions/update/${transaction?.id}`)}>
          <Pen color={colors.backgroundWhite} size={24} />
          <Text style={styles.rightActionText}>Editar</Text>
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

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

  return (
    <Container style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Typography variant="heading/lg">Transações</Typography>
          <View style={styles.actionButtons}>
            <Button
              variant="ghost"
              disabled={isSyncing}
              onPress={() => router.navigate('/private/(tabs)/transactions/create')}
              style={{ height: 'auto', padding: 0 }}>
              <Plus color={colors.primary} size={28} />
            </Button>
          </View>
        </View>

        <BalanceHeader />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={transactions}
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Separator />}
          ListEmptyComponent={() => (
            <View>
              <Typography variant="body/md" align="center">
                Nenhuma transação encontrada!
              </Typography>
            </View>
          )}
          renderItem={({ item }) => (
            <ReanimatedSwipeable
              friction={2}
              enableTrackpadTwoFingerGesture
              rightThreshold={40}
              renderLeftActions={(prag, drag) => LeftAction(prag, drag, item)}
              renderRightActions={(prag, drag) => RightAction(prag, drag, item)}>
              <Pressable
                style={styles.transactionCard}
                onPress={() => router.push(`/private/transactions/${item.id}`)}>
                <View style={styles.transactionContent}>
                  <Typography variant="heading/sm">
                    {item.name}{' '}
                    {item.installment &&
                      item.installment_qtd &&
                      `${item.installment}/${item.installment_qtd}`}
                  </Typography>
                  <Typography variant="body/sm">{formatDate(item.date)}</Typography>
                </View>
                <Typography variant="heading/sm" color={item.type === 1 ? 'text' : 'red'}>
                  {item.type !== 1 && '-'} {formatCurrency(item.amount)}
                </Typography>
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  leftAction: {
    width: 80,
    height: '100%',
    backgroundColor: colors.green,
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

  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingRight: 4,
  },
  transactionContent: {
    gap: 4,
  },

  content: {
    gap: 16,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

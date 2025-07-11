import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Container } from '@/components/Container';
import React from 'react';

import { Button } from '@/components/Button';
import { BalanceHeader } from '@/components/Header/BalanceHeader';
import { Loading } from '@/components/Loading';
import { Separator } from '@/components/Separator';
import { SelectMonthModal } from '@/components/Sheets/SelectMonthModal';
import { TransactionTypeModal } from '@/components/Sheets/SelectTransactionType';
import { SelectYearModal } from '@/components/Sheets/SelectYearModal';
import { Typography } from '@/components/Typography';
import { useTransactions } from '@/hooks/features/useTransactions';
import { ITransaction } from '@/store/transactions/transactions.types';
import { colors } from '@/styles/colors';
import { formatCurrency, formatDate } from '@/utils';
import { router } from 'expo-router';
import { Pen, Plus, Trash } from 'lucide-react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

export default function Index() {
  const {
    transactions,
    selectedTransactionType,
    selectedMonth,
    selectedYear,
    handleOpenSelectMonthModal,
    handleOpenSelectYearModal,
    handleOpenTransactionTypeModal,
    isTransactionTypeFilterOpen,
    handleCloseTransactionTypeModal,
    setTransactionTypeFilter,
    setSelectedMonth,
    isSelectMonthModalOpen,
    handleCloseSelectMonthModal,
    setSelectedYear,
    isSelectYearModalOpen,
    handleCloseSelectYearModal,
    deleteTransactionMutation,
  } = useTransactions();
  const { data: response } = transactions;

  function confirmDelete(transaction: ITransaction) {
    Alert.alert(`Tem certeza que deseja apagar esta transação: ${transaction?.name} `, '', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Apagar',
        onPress: async () => {
          try {
            await deleteTransactionMutation.mutateAsync(transaction.id);
            Alert.alert('Transação apagada com sucesso!');
          } catch (error) {
            console.error('Erro ao deletar transação:', error);
            Alert.alert('Erro', 'Não foi possível apagar a transação. Tente novamente mais tarde.');
          }
        },
        style: 'destructive',
      },
    ]);
  }

  const RightAction = (
    prog: SharedValue<number>,
    drag: SharedValue<number>,
    transaction: ITransaction,
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
    transaction: ITransaction,
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

  return (
    <Container style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Typography variant="heading/lg">Transações</Typography>
          <View style={styles.actionButtons}>
            <Button
              variant="ghost"
              onPress={() => router.navigate('/private/(tabs)/transactions/create')}
              style={{ height: 'auto', padding: 0 }}>
              <Plus color={colors.primary} size={28} />
            </Button>
          </View>
        </View>

        <BalanceHeader
          selectedTransactionType={selectedTransactionType}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          handleOpenSelectMonthModal={handleOpenSelectMonthModal}
          handleOpenSelectYearModal={handleOpenSelectYearModal}
          handleOpenTransactionTypeModal={handleOpenTransactionTypeModal}
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={response?.data || []}
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Separator />}
          ListEmptyComponent={() => (
            <View>
              {transactions.isLoading || transactions.isRefetching ? (
                <View style={styles.center}>
                  <Loading />
                </View>
              ) : (
                <Typography variant="body/md" align="center">
                  Nenhuma transação encontrada!
                </Typography>
              )}
            </View>
          )}
          renderItem={({ item }) => (
            <ReanimatedSwipeable
              friction={2}
              enableTrackpadTwoFingerGesture
              rightThreshold={40}
              renderLeftActions={(prag, drag) => LeftAction(prag, drag, item as any)}
              renderRightActions={(prag, drag) => RightAction(prag, drag, item as any)}>
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
                <View style={styles.transactionAmountContent}>
                  <Typography variant="heading/sm" color={item.type === 1 ? 'text' : 'red'}>
                    {item.type !== 1 && '-'} {formatCurrency(item.amount)}
                  </Typography>
                  <Typography variant="body/sm">{item?.categories?.name}</Typography>
                </View>
              </Pressable>
            </ReanimatedSwipeable>
          )}
        />
      </View>

      <SelectMonthModal
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        isSelectMonthModalOpen={isSelectMonthModalOpen}
        handleCloseSelectMonthModal={handleCloseSelectMonthModal}
      />
      <SelectYearModal
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        isSelectYearModalOpen={isSelectYearModalOpen}
        handleCloseSelectYearModal={handleCloseSelectYearModal}
      />
      <TransactionTypeModal
        selectedTransactionType={selectedTransactionType}
        setTransactionTypeFilter={setTransactionTypeFilter}
        isTransactionTypeFilterOpen={isTransactionTypeFilterOpen}
        handleCloseTransactionTypeModal={handleCloseTransactionTypeModal}
      />
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

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listContainer: {
    maxHeight: '88%',
    paddingBottom: 50,
  },
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

  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingRight: 4,
  },
  transactionContent: {
    gap: 4,
  },
  transactionAmountContent: {
    gap: 4,
    alignItems: 'flex-end',
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

import { Alert, StyleSheet, View } from 'react-native';

import { Container } from '@/components/Container';
import React from 'react';

import { Button } from '@/components/Button';
import { BalanceHeader } from '@/components/Header/BalanceHeader';
import { SelectMonthModal } from '@/components/Sheets/SelectMonthModal';
import { TransactionTypeModal } from '@/components/Sheets/SelectTransactionType';
import { SelectYearModal } from '@/components/Sheets/SelectYearModal';
import { Transactions } from '@/components/Transactions';
import { Typography } from '@/components/Typography';
import { useMonthBalance } from '@/hooks/features/useMonthBalance';
import { useTransactions } from '@/hooks/features/useTransactions';
import { ITransaction } from '@/store/transactions/transactions.types';
import { colors } from '@/styles/colors';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';

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
    currentMonth,
    currentYear,
  } = useTransactions();
  const { response: monthBalanceResponse } = useMonthBalance();

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
          response={monthBalanceResponse}
          month={currentMonth.value}
          year={currentYear}
        />
      </View>
      <View style={styles.listContainer}>
        <Transactions
          data={response?.data || []}
          onDelete={confirmDelete}
          isLoading={transactions.isLoading || transactions.isRefetching || transactions.isPending}
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

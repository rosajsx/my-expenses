import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';

import { Container } from '../components/Container';
import { Typography } from '../components/Typography';
import { useDatabase } from '../hooks/useDatabase';
import { useCallback, useMemo } from 'react';
import { theme } from '../styles/theme';

import { TransactionCard } from '../components/TransactionList/transactionCard';
import { formatCurrency, getAllMonthsOfYear, getLast5Years } from '../utils';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';
import { ArrowDown, ArrowUp, Calendar, Plus, RotateCw, Search, X } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useBoundStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { ScreenStateEnum } from '../enums/screenStates';

const currentMonth = new Date().getMonth();

export default function Index() {
  const { transactions, getTransactions, transactionsState } = useBoundStore(
    useShallow((state) => ({
      transactions: state.transactions,
      getTransactions: state.getTransactions,
      transactionsState: state.transactionsState,
    })),
  );

  const { balance, monthBalance, balanceInView, toggleBalanceInView, getBalances, balancesState } =
    useBoundStore(
      useShallow((state) => ({
        balance: state.balance,
        monthBalance: state.monthBalance,
        balanceInView: state.balanceInView,
        toggleBalanceInView: state.toggleBalanceView,
        getBalances: state.getBalances,
        balancesState: state.balanceState,
      })),
    );

  const {
    selectedMonth,
    selectedYear,
    setSelectedYear,
    setSelectedMonth,
    isSelectMonthModalOpen,
    isSelectYearModalOpen,
    openSelectMonthModal,
    closeSelectMonthModal,
    openSelectYearModal,
    closeSelectYearModal,
    resetFilters,
    toggleTransactionsFilter,
    transactionTypeFilter,
  } = useBoundStore(
    useShallow((state) => ({
      selectedYear: state.selectedYear,
      selectedMonth: state.selectedMonth,
      setSelectedYear: state.setSelectedYear,
      setSelectedMonth: state.setSelectedMonth,
      transactionTypeFilter: state.transactionTypeFilter,
      isSelectMonthModalOpen: state.isSelectMonthModalOpen,
      isSelectYearModalOpen: state.isSelectYearModalOpen,
      openSelectYearModal: state.handleOpenSelectYearModal,
      closeSelectYearModal: state.handleCloseSelectYearModal,
      openSelectMonthModal: state.handleOpenSelectMonthModal,
      closeSelectMonthModal: state.handleCloseSelectMonthModal,
      resetFilters: state.resetTransactionFilters,
      toggleTransactionsFilter: state.toggleTransactionTypeFiler,
    })),
  );

  const { database } = useDatabase();

  const years = useMemo(() => {
    return getLast5Years();
  }, []);

  const months = useMemo(() => {
    return getAllMonthsOfYear();
  }, []);

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

  return (
    <Container style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Pressable style={styles.balanceHeader} onPress={toggleBalanceInView}>
            <Typography variant="subtitle">
              {balanceInView === 'GENERAL' ? 'Saldo total:' : `Saldo ${months[currentMonth].value}`}
            </Typography>

            {balancesState === ScreenStateEnum.DEFAULT && (
              <Typography variant="subtitle" color={balance < 0 ? 'error' : 'textPrimary'}>
                {balanceInView === 'GENERAL'
                  ? formatCurrency(balance)
                  : formatCurrency(monthBalance)}
              </Typography>
            )}
          </Pressable>
          <Typography variant="label">Toque no saldo para mudar a visualização</Typography>

          {balancesState === ScreenStateEnum.LOADING && <Loading size="sm" />}
          {balancesState === ScreenStateEnum.ERROR && (
            <Button Icon={RotateCw} variant="secondary" onPress={handleGetBalances} />
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
        data={transactions}
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={(list) => (
          <TransactionCard transaction={list.item} database={database} refetch={updateData} />
        )}
        ListHeaderComponent={
          <View style={styles.filter}>
            <Typography variant="subtitle">Extrato</Typography>

            <View style={styles.filterItems}>
              <TouchableOpacity style={styles.filterItem} onPress={openSelectMonthModal}>
                <Calendar
                  color={selectedMonth ? theme.colors.primary : theme.colors.textSecondary}
                  size="20px"
                />
                <Typography>{!selectedMonth ? 'Mês' : selectedMonth.value}</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterItem} onPress={openSelectYearModal}>
                <Calendar
                  color={selectedYear ? theme.colors.primary : theme.colors.textSecondary}
                  size="20px"
                />
                <Typography>{!selectedYear ? 'Ano' : selectedYear}</Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterItem,
                  transactionTypeFilter === 1 && styles.incomeItem,
                  transactionTypeFilter === 2 && styles.outcomeItem,
                ]}
                onPress={toggleTransactionsFilter}>
                {transactionTypeFilter === 1 && (
                  <ArrowUp size="20px" color={theme.colors.success} />
                )}
                {transactionTypeFilter === 2 && (
                  <ArrowDown size="20px" color={theme.colors.error} />
                )}

                <Typography
                  color={
                    transactionTypeFilter === 1
                      ? 'success'
                      : transactionTypeFilter === 2
                        ? 'error'
                        : 'textPrimary'
                  }>
                  {transactionTypeFilter === 1 && 'Entradas'}
                  {transactionTypeFilter === 2 && 'Saídas'}
                  {!transactionTypeFilter && 'Tipo'}
                </Typography>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.filterItem]} onPress={handleGetTransactions}>
              <Search
                color={selectedYear ? theme.colors.primary : theme.colors.textSecondary}
                size="20px"
              />
              <Typography>Filtrar</Typography>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <>
            {transactionsState === ScreenStateEnum.LOADING && (
              <View style={styles.emptyLoading}>
                <Loading />
              </View>
            )}

            {transactionsState === ScreenStateEnum.ERROR && (
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

                <Button title="Recarregar" onPress={handleGetTransactions} />
              </View>
            )}

            {transactionsState == ScreenStateEnum.DEFAULT && (
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

      <Modal transparent visible={isSelectYearModalOpen} onRequestClose={closeSelectYearModal}>
        <SafeAreaView style={styles.modalView}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Pressable onPress={closeSelectYearModal}>
                <X />
              </Pressable>
            </View>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(value) => {
                setSelectedYear(value);
              }}>
              <Picker.Item label="Todos" value={''} />
              {years.map((year) => (
                <Picker.Item key={year} label={`${year}`} value={year} />
              ))}
            </Picker>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal transparent visible={isSelectMonthModalOpen} onRequestClose={closeSelectMonthModal}>
        <SafeAreaView style={styles.modalView}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Pressable onPress={closeSelectMonthModal}>
                <X />
              </Pressable>
            </View>
            <Picker
              selectedValue={selectedMonth?.id}
              onValueChange={(value) => {
                setSelectedMonth(months[value]);
              }}>
              <Picker.Item label="Todos" value={''} />
              {months.map((month) => (
                <Picker.Item key={month.id} label={month.value} value={month.id} />
              ))}
            </Picker>
          </View>
        </SafeAreaView>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    width: '80%',
  },
  modalHeader: {
    width: '100%',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: theme.colors.black50,
  },
  container: {
    position: 'relative',
  },
  filter: {
    gap: theme.spacing.sm,
  },
  incomeItem: {
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  outcomeItem: {
    borderWidth: 1,
    borderColor: theme.colors.error,
  },

  filterItem: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardBackground,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    width: '100%',
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

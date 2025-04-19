import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';

import { Container } from '../components/Container';
import { Typography } from '../components/Typography';
import { useDatabase } from '../hooks/useDatabase';
import { useCallback, useMemo, useState } from 'react';
import { Transaction } from '../database/types';
import { getAllTransactions } from '../database/transactions/getAllTransactions';
import { theme } from '../styles/theme';

import { TransactionCard } from '../components/transactionCard';
import { getCacheAccountBalance } from '../database/accountSummary/getCachedBalance';
import { formatCurrency, getAllMonthsOfYear, getLast5Years } from '../utils';
import { createTransaction } from '../database/transactions/createTransaction';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';
import { ArrowDown, ArrowUp, Calendar, Plus, RotateCw, Search, X } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function Index() {
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [haveErrorOnTransactions, setHaveErrorOnTransactions] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [haveErrorOnBalance, setHaveErrorOnBalance] = useState(false);
  const [data, setData] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);

  const [selectedYear, setSelectedYear] = useState<string>();
  const [isSelectYearModalOpen, setIsSelectYearModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<{ id: number; value: string }>();
  const [isSelectMonthModalOpen, setIsSelectMonthModalOpen] = useState(false);
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<number>();

  const { database } = useDatabase();

  const years = useMemo(() => {
    return getLast5Years();
  }, []);

  const months = useMemo(() => {
    return getAllMonthsOfYear();
  }, []);

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

  const getFilteredTransactions = () => {
    if (haveErrorOnTransactions) setHaveErrorOnTransactions(false);
    setIsLoadingTransactions(true);
    getAllTransactions(database, {
      month: selectedMonth?.id,
      year: selectedYear ? Number(selectedYear) : undefined,
      transactionType: transactionTypeFilter,
    })
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

  const updateData = () => {
    getTransactions();
    getBalance();
  };

  const handlePressTypeFilter = () => {
    setTransactionTypeFilter((prevState) => {
      if (!prevState) {
        return 1;
      }
      if (prevState === 1) {
        return 2;
      }

      if (prevState === 2) {
        return undefined;
      }

      return;
    });
  };

  useFocusEffect(
    useCallback(() => {
      updateData();
      setSelectedYear(undefined);
      setSelectedMonth(undefined);
      setTransactionTypeFilter(undefined);
    }, []),
  );

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
        showsVerticalScrollIndicator={false}
        renderItem={(list) => (
          <TransactionCard transaction={list.item} database={database} refetch={updateData} />
        )}
        ListHeaderComponent={
          <View style={styles.filter}>
            <Typography variant="subtitle">Extrato</Typography>

            <View style={styles.filterItems}>
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => setIsSelectMonthModalOpen(true)}>
                <Calendar
                  color={selectedMonth ? theme.colors.primary : theme.colors.textSecondary}
                  size="20px"
                />
                <Typography>{!selectedMonth ? 'Mês' : selectedMonth.value}</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => setIsSelectYearModalOpen(true)}>
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
                onPress={handlePressTypeFilter}>
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
            <TouchableOpacity style={[styles.filterItem]} onPress={getFilteredTransactions}>
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

      <Modal
        transparent
        visible={isSelectYearModalOpen}
        onRequestClose={() => {
          setIsSelectYearModalOpen(false);
        }}>
        <SafeAreaView style={styles.modalView}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setIsSelectYearModalOpen(false)}>
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

      <Modal
        transparent
        visible={isSelectMonthModalOpen}
        onRequestClose={() => {
          setIsSelectMonthModalOpen(false);
        }}>
        <SafeAreaView style={styles.modalView}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setIsSelectMonthModalOpen(false)}>
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

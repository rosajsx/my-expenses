import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { theme } from '@/src/styles/theme';
import { FilterButton } from './FilterButton';
import { useBoundStore } from '@/src/store';
import { useShallow } from 'zustand/react/shallow';
import { Calendar, Search } from 'lucide-react-native';

interface TransactionListHeaderProps {
  onFilter: () => void;
}

export function TransactionListHeader({ onFilter }: TransactionListHeaderProps) {
  const {
    selectedMonth,
    selectedYear,
    openSelectMonthModal,
    openSelectYearModal,
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

  return (
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

        <FilterButton
          style={
            transactionTypeFilter === 1
              ? styles.incomeItem
              : transactionTypeFilter === 2
                ? styles.outcomeItem
                : {}
          }
          onPress={toggleTransactionsFilter}
          icon={
            transactionTypeFilter === 1
              ? 'ArrowUp'
              : transactionTypeFilter === 2
                ? 'ArrowDown'
                : undefined
          }
          iconColor={transactionTypeFilter === 1 ? 'success' : 'error'}
          text={
            transactionTypeFilter === 1
              ? 'Entradas'
              : transactionTypeFilter === 2
                ? 'Saídas'
                : 'Tipo'
          }
        />
      </View>
      <TouchableOpacity style={[styles.filterItem]} onPress={onFilter}>
        <Search
          color={selectedYear ? theme.colors.primary : theme.colors.textSecondary}
          size="20px"
        />
        <Typography>Filtrar</Typography>
      </TouchableOpacity>
    </View>
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

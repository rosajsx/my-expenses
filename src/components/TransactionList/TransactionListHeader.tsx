import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { theme } from '@/src/styles/theme';
import { FilterButton } from './FilterButton';

export function TransactionListHeader() {
  return (
    <View style={styles.filter}>
      <Typography variant="subtitle">Extrato</Typography>

      <View style={styles.filterItems}>
        <TouchableOpacity style={styles.filterItem} onPress={() => setIsSelectMonthModalOpen(true)}>
          <Calendar
            color={selectedMonth ? theme.colors.primary : theme.colors.textSecondary}
            size="20px"
          />
          <Typography>{!selectedMonth ? 'Mês' : selectedMonth.value}</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterItem} onPress={() => setIsSelectYearModalOpen(true)}>
          <Calendar
            color={selectedYear ? theme.colors.primary : theme.colors.textSecondary}
            size="20px"
          />
          <Typography>{!selectedYear ? 'Ano' : selectedYear}</Typography>
        </TouchableOpacity>

        <FilterButton
          style={transactionTypeFilter === 1 ? styles.incomeItem : styles.outcomeItem}
          onPress={handlePressTypeFilter}
          icon={transactionTypeFilter === 1 ? 'ArrowUp' : 'ArrowDown'}
        />
        <TouchableOpacity
          style={[
            styles.filterItem,
            transactionTypeFilter === 1 && styles.incomeItem,
            transactionTypeFilter === 2 && styles.outcomeItem,
          ]}
          onPress={handlePressTypeFilter}>
          {transactionTypeFilter === 1 && <ArrowUp size="20px" color={theme.colors.success} />}
          {transactionTypeFilter === 2 && <ArrowDown size="20px" color={theme.colors.error} />}

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

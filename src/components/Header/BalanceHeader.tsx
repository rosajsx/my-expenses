import { ICategory, SelectedMonth } from '@/store/transactions/transactions.types';
import { colors } from '@/styles/colors';
import { formatCurrency } from '@/utils';
import { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Loading } from '../Loading';
import { Separator } from '../Separator';
import { Typography } from '../Typography';

interface BalanceHeaderProps {
  selectedMonth?: SelectedMonth;
  selectedYear?: string;
  selectedCategory?: ICategory;
  selectedTransactionType?: number;
  handleOpenTransactionTypeModal?: () => void;
  handleOpenSelectMonthModal?: () => void;
  handleOpenSelectCategoryModal?: () => void;
  handleOpenSelectYearModal?: () => void;
  month: string;
  year: number;
  filters?: boolean;
  response: UseQueryResult<
    {
      total: number;
      income: number;
      outcome: number;
    },
    Error
  >;
}

export const BalanceHeader = ({
  selectedTransactionType,
  selectedMonth,
  selectedYear,
  handleOpenSelectMonthModal,
  handleOpenSelectYearModal,
  handleOpenTransactionTypeModal,
  filters = true,
  response,
  month,
  year,
  selectedCategory,
  handleOpenSelectCategoryModal,
}: BalanceHeaderProps) => {
  const monthBalance = response.data?.total || 0;

  const getBalanceStatusColor = () => {
    if (monthBalance === 0 || !monthBalance) {
      return colors.text;
    }
    if (monthBalance > 0) {
      return colors.primary;
    } else {
      return colors.red;
    }
  };

  return (
    <View>
      <View>
        {(response?.isLoading || response?.isRefetching) && <Loading size="sm" />}
        {response?.isSuccess && (
          <>
            <Text style={styles.balanceText}>
              Total {month} de {year}
            </Text>

            <Text
              style={[
                styles.amountText,
                {
                  color: getBalanceStatusColor(),
                },
              ]}>
              {formatCurrency(monthBalance)}
            </Text>
            <Separator color="gray" styles={{ marginVertical: 16 }} />
            <View style={styles.balanceDetailsContainer}>
              <View>
                <Typography style={styles.balanceText}>Entradas:</Typography>
                <Typography>{formatCurrency(response.data?.income || 0)}</Typography>
              </View>
              <View>
                <Typography style={styles.balanceText}>Saidas:</Typography>
                <Typography>{formatCurrency(response.data?.outcome || 0)}</Typography>
              </View>
            </View>
          </>
        )}
        {response?.isError && (
          <Text style={[styles.amountText, { color: colors.red }]}>Erro ao carregar saldo</Text>
        )}
      </View>

      {filters && (
        <View style={styles.filterContainer}>
          <Typography variant="body/sm">Filtros</Typography>
          <View style={styles.filterContainerRow}>
            <TouchableOpacity
              onPress={handleOpenSelectCategoryModal}
              style={[
                styles.filterButton,
                !selectedCategory ? styles.filterButtonInactive : styles.filterButtonActive,
              ]}>
              <Text
                style={[
                  styles.filterText,
                  !selectedCategory ? styles.filterTextInactive : styles.filterTextActive,
                ]}>
                {selectedCategory?.name ? selectedCategory.name : 'Todas as categorias'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOpenSelectMonthModal}
              style={[
                styles.filterButton,
                !selectedMonth?.value ? styles.filterButtonInactive : styles.filterButtonActive,
              ]}>
              <Text
                style={[
                  styles.filterText,
                  !selectedMonth?.value ? styles.filterTextInactive : styles.filterTextActive,
                ]}>
                {selectedMonth?.value ? selectedMonth.value : 'Todos os meses'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterContainerRow}>
            <TouchableOpacity
              onPress={handleOpenSelectYearModal}
              style={[
                styles.filterButton,
                !selectedYear ? styles.filterButtonInactive : styles.filterButtonActive,
              ]}>
              <Text
                style={[
                  styles.filterText,
                  !selectedYear ? styles.filterTextInactive : styles.filterTextActive,
                ]}>
                {selectedYear || year}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOpenTransactionTypeModal}
              style={[
                styles.filterButton,
                !selectedTransactionType ? styles.filterButtonInactive : styles.filterButtonActive,
              ]}>
              <Text
                style={[
                  styles.filterText,
                  !selectedTransactionType ? styles.filterTextInactive : styles.filterTextActive,
                ]}>
                {selectedTransactionType
                  ? selectedTransactionType === 1
                    ? 'Entradas'
                    : 'Saídas'
                  : 'Todos os tipos'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  balanceText: {
    fontFamily: 'Inter_400Regular',
    fontWeight: 400,
    fontSize: 15,
    color: colors.textSecondary,
  },
  amountText: {
    fontFamily: 'Inter_700Bold',
    fontWeight: 700,
    fontSize: 24,
  },
  balanceDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    gap: 24,
  },

  filterContainer: {
    paddingVertical: 16,
    gap: 8,
  },
  filterContainerRow: {
    flexDirection: 'row',
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonInactive: {
    backgroundColor: colors.backgroundWhite,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  filterText: {
    fontFamily: 'Inter_500Medium',
    fontWeight: 'bold',
    fontSize: 14,
  },
  filterTextActive: {
    color: colors.white,
  },
  filterTextInactive: {
    color: colors.primary,
  },
});

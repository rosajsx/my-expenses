import { useBalances } from '@/hooks/features/useBalances';
import { SelectedMonth } from '@/store/transactions/transactions.types';
import { colors } from '@/styles/colors';
import { formatCurrency, getAllMonthsOfYear } from '@/utils';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Loading } from '../Loading';

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
const months = getAllMonthsOfYear();

interface BalanceHeaderProps {
  selectedMonth?: SelectedMonth;
  selectedYear?: string;
  selectedTransactionType?: number;
  handleOpenTransactionTypeModal: () => void;
  handleOpenSelectMonthModal: () => void;
  handleOpenSelectYearModal: () => void;
}

export const BalanceHeader = ({
  selectedTransactionType,
  selectedMonth,
  selectedYear,
  handleOpenSelectMonthModal,
  handleOpenSelectYearModal,
  handleOpenTransactionTypeModal,
}: BalanceHeaderProps) => {
  const { response } = useBalances();
  const monthBalance = response.data || 0;

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
        {response?.isLoading && <Loading size="sm" />}
        {response?.isSuccess && (
          <>
            <Text style={styles.balanceText}>
              Saldo {months[currentMonth].value} de {currentYear}
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
          </>
        )}
        {response?.isError && (
          <Text style={[styles.amountText, { color: colors.red }]}>Erro ao carregar saldo</Text>
        )}
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.filterContainer}
        showsHorizontalScrollIndicator={false}>
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
            Mês: {selectedMonth?.value || 'Todos'}
          </Text>
        </TouchableOpacity>
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
            Ano: {selectedYear || currentYear}
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
            Tipo:{' '}
            {selectedTransactionType
              ? selectedTransactionType === 1
                ? 'Entradas'
                : 'Saídas'
              : 'Todos'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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

  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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

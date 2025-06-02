import { Container } from '@/components/Container';
import { deleteTransaction } from '@/database/transactions/deleteTransaction';
import { getTransactionById } from '@/database/transactions/getTransactionById';
import { Transaction } from '@/database/types';
import { ScreenStateEnum } from '@/enums/screenStates';
import { useDatabase } from '@/hooks/useDatabase';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { useScreenState } from '@/hooks/useScreenState';
import { useBoundStore } from '@/store';
import { formatCurrency, formatDate } from '@/utils';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../../styles/colors';

export default function TransactionDetails() {
  const [transaction, setTransaction] = useState<Transaction>();
  const { database } = useDatabase();
  const { id } = useLocalSearchParams<{ id: string }>();
  const getBalances = useBoundStore((state) => state.getBalances);

  const {
    isScreenStateLoading,
    isScreenStateError,
    isScreenStateDefault,
    handleChangeScreenStateToDefault,
    handleChangeScreenStateToError,
    handleChangeScreenStateToLoading,
  } = useScreenState(ScreenStateEnum.LOADING);

  useHideTabBar();

  useFocusEffect(
    useCallback(() => {
      handleChangeScreenStateToLoading();
      getTransactionById(database, id)
        .then((response) => {
          setTransaction(response!);
          handleChangeScreenStateToDefault();
        })
        .catch((error) => {
          console.log(error);
          handleChangeScreenStateToError();
        });
    }, []),
  );

  const handleEdit = () => {
    router.navigate(`/transactions/update/${transaction?.id}`);
  };

  async function handleDelete() {
    try {
      await deleteTransaction(database, transaction!);
      await getBalances(database);
      router.navigate('/transactions', {
        params: {
          update: true,
        },
      } as any);

      Alert.alert('Transação deletada com sucesso!');
    } catch (error) {
      console.log(error);
      Alert.alert('Ocorreu um erro inesperado', JSON.stringify(error));
    }
  }

  function confirmDelete() {
    Alert.alert(`Tem certeza que deseja apagar esta transação: ${transaction?.name} `, '', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Apagar',
        onPress: handleDelete,
        style: 'destructive',
      },
    ]);
  }

  return (
    <Container style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back} style={styles.iconBack}>
          <ChevronLeft color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {transaction?.name}{' '}
          {transaction?.installment &&
            transaction?.installment_qtd &&
            `${transaction?.installment}/${transaction?.installment_qtd}`}
        </Text>
        <Text
          style={[
            styles.amount,
            transaction?.type === 1 ? styles.amountIncome : styles.amountOutcome,
          ]}>
          {transaction?.type === 2 && '- '}
          {transaction?.amount && formatCurrency(transaction?.amount)}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        {transaction?.category && (
          <View style={styles.detailItem}>
            <Text style={styles.detailItemLabel}>Categoria</Text>
            <Text style={styles.detailItemValue}>{transaction.category}</Text>
          </View>
        )}
        {transaction?.type && (
          <View style={styles.detailItem}>
            <Text style={styles.detailItemLabel}>Tipo</Text>
            <Text style={styles.detailItemValue}>
              {transaction?.type === 1 ? 'Entrada' : 'Saída'}
            </Text>
          </View>
        )}

        {transaction?.date && (
          <View style={styles.detailItem}>
            <Text style={styles.detailItemLabel}>Data</Text>
            <Text style={styles.detailItemValue}>{formatDate(transaction?.date)}</Text>
          </View>
        )}
        {transaction?.installment && transaction?.installment_qtd && (
          <View style={styles.detailItem}>
            <Text style={styles.detailItemLabel}>Parcelamento</Text>
            <Text style={styles.detailItemValue}>
              {transaction?.installment}/{transaction.installment_qtd}
            </Text>
          </View>
        )}
        {transaction?.pendingSync && (
          <View style={styles.detailItem}>
            <Text style={styles.detailItemLabel}>Status</Text>
            <Text style={styles.detailItemValue}>
              {transaction?.pendingSync === 1 ? 'Pendente de Sincronização' : 'Sincronizado!'}
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
        <Text style={styles.deleteText}>Apagar Transação</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBack: {
    width: 44,
    height: 44,
  },
  editButton: {
    width: 44,
    height: 44,
  },
  editText: {
    fontFamily: 'Inter_400Regular',
    fontWeight: 400,
    fontSize: 14,
    color: colors.primary,
  },
  titleContainer: {
    gap: 4,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontWeight: 600,
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
  },
  amount: {
    fontFamily: 'Inter_600SemiBold',
    fontWeight: 600,
    fontSize: 22,
    textAlign: 'center',
  },
  amountIncome: {
    color: colors.green,
  },
  amountOutcome: {
    color: colors.red,
  },

  detailsContainer: {
    borderRadius: 12,

    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  detailItem: {
    minHeight: 44,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: colors.separator,
  },
  detailItemLabel: {
    fontFamily: 'Inter_400Regular',
    fontWeight: 400,
    color: colors.text,
    fontSize: 15,
  },
  detailItemValue: {
    fontFamily: 'Inter_500Medium',
    fontWeight: 500,
    color: colors.textSecondary,
    fontSize: 15,
  },
  deleteBtn: {
    borderRadius: 12,
    height: 52,
    width: '100%',

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  deleteText: {
    fontFamily: 'Inter_600SemiBold',
    fontWeight: 600,
    fontSize: 17,
    color: colors.red,
  },
});

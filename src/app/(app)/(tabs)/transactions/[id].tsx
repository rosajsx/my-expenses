import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Typography } from '@/components/Typography';
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
import { Alert, StyleSheet, View } from 'react-native';
import { colors } from '../../../../styles/colors';

export default function TransactionDetails() {
  const [transaction, setTransaction] = useState<Transaction>();
  const { database } = useDatabase();
  const { id } = useLocalSearchParams<{ id: string }>();
  const getBalances = useBoundStore((state) => state.getBalances);

  const {
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
        <Button variant="ghost" onPress={router.back} style={{ height: 'auto', padding: 0 }}>
          <ChevronLeft color={colors.primary} />
        </Button>

        <Button title="Editar" variant="ghost" onPress={handleEdit} />
      </View>
      <View style={styles.titleContainer}>
        <Typography variant="heading/lg" align="center">
          {transaction?.name}{' '}
          {transaction?.installment &&
            transaction?.installment_qtd &&
            `${transaction?.installment}/${transaction?.installment_qtd}`}
        </Typography>
        <Typography
          align="center"
          variant="heading/lg"
          color={transaction?.type === 1 ? 'green' : 'red'}>
          {transaction?.type === 2 && '- '}
          {transaction?.amount && formatCurrency(transaction?.amount)}
        </Typography>
      </View>
      <View style={styles.detailsContainer}>
        {transaction?.category && (
          <View style={styles.detailItem}>
            <Typography variant="body/md">Categoria</Typography>
            <Typography variant="body/md">{transaction.category}</Typography>
          </View>
        )}
        {transaction?.type && (
          <View style={styles.detailItem}>
            <Typography variant="body/md" color="text">
              Tipo
            </Typography>
            <Typography variant="body/md">
              {transaction?.type === 1 ? 'Entrada' : 'Saída'}
            </Typography>
          </View>
        )}

        {transaction?.date && (
          <View style={styles.detailItem}>
            <Typography variant="body/md" color="text">
              Data
            </Typography>
            <Typography variant="body/md">{formatDate(transaction?.date)}</Typography>
          </View>
        )}
        {transaction?.installment && transaction?.installment_qtd && (
          <View style={styles.detailItem}>
            <Typography variant="body/md" color="text">
              Parcelamento
            </Typography>
            <Typography variant="body/md">
              {transaction?.installment}/{transaction.installment_qtd}
            </Typography>
          </View>
        )}
        {transaction?.pendingSync && (
          <View style={styles.detailItem}>
            <Typography variant="body/md" color="text">
              Status
            </Typography>
            <Typography variant="body/md">
              {transaction?.pendingSync === 1 ? 'Pendente de Sincronização' : 'Sincronizado!'}
            </Typography>
          </View>
        )}
      </View>
      <Button title="Apagar Transação" variant="danger" onPress={confirmDelete} />
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

  editButton: {
    width: 44,
    height: 44,
  },

  titleContainer: {
    gap: 4,
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
});

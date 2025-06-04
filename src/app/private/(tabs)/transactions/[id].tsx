import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { PageHeader } from '@/components/Header/index';
import { Typography } from '@/components/Typography';
import { ScreenStateEnum } from '@/enums/screenStates';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { useScreenState } from '@/hooks/useScreenState';
import { deleteTransactionById } from '@/services/transactions/deleteTransaction';
import { getTransactionById } from '@/services/transactions/getTransactionById';
import { useBoundStore } from '@/store';
import { ITransaction } from '@/store/slices/transactionsSlice';
import { formatCurrency, formatDate } from '@/utils';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { colors } from '../../../../styles/colors';

export default function TransactionDetails() {
  const [transaction, setTransaction] = useState<ITransaction>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = useBoundStore((state) => state.session);

  const {
    handleChangeScreenStateToDefault,
    handleChangeScreenStateToError,
    handleChangeScreenStateToLoading,
  } = useScreenState(ScreenStateEnum.LOADING);

  useHideTabBar();

  useFocusEffect(
    useCallback(() => {
      handleChangeScreenStateToLoading();
      getTransactionById(session?.user?.id!, Number(id))
        .then((response) => {
          console.log({ response });
          setTransaction(response.data as ITransaction);
          handleChangeScreenStateToDefault();
        })
        .catch((error) => {
          console.log(error);
          handleChangeScreenStateToError();
        });
    }, []),
  );

  const handleEdit = () => {
    router.navigate(`/private/transactions/update/${transaction?.id}`);
  };

  async function handleDelete() {
    try {
      await deleteTransactionById(session?.user?.id!, transaction?.id!);
      router.navigate('/private/transactions');

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
      <PageHeader actionText="Editar" onAction={handleEdit} />
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
      <Card spacing={0} paddingVertical={0} paddingHorizontal={16}>
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
      </Card>
      <Button title="Apagar Transação" variant="danger" onPress={confirmDelete} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },

  titleContainer: {
    gap: 4,
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

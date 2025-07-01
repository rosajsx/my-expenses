import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Error } from '@/components/Error';
import { PageHeader } from '@/components/Header/index';
import { Loading } from '@/components/Loading';
import { Typography } from '@/components/Typography';
import { useTransaction } from '@/hooks/features/useTransaction';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { formatCurrency, formatDate } from '@/utils';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { colors } from '../../../../styles/colors';

export default function TransactionDetails() {
  const { response, deleteTransactionMutation } = useTransaction();

  const transaction = response.data;
  const status = response.status;

  useHideTabBar();

  const handleEdit = () => {
    router.navigate(`/private/transactions/update/${transaction?.id}`);
  };

  async function handleDelete() {
    try {
      await deleteTransactionMutation.mutateAsync();
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
      <PageHeader
        actionText="Editar"
        onAction={handleEdit}
        isActionButtonDisabled={status === 'error' || status === 'pending'}
      />

      {status === 'pending' && (
        <View style={styles.center}>
          <Loading />
        </View>
      )}

      {status === 'error' && <Error message="Ocorreu um erro ao carregar a transação" />}

      {status === 'success' && transaction && (
        <>
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
                <Typography variant="body/md" color="text">
                  Categoria
                </Typography>
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
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleContainer: {
    gap: 4,
    marginTop: 56,
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

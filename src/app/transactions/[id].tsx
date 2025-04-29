import { Button } from '@/src/components/Button';
import { Container } from '@/src/components/Container';
import { Typography } from '@/src/components/Typography';
import { Transaction } from '@/src/database/types';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Pen, Trash, X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { getTransactionById } from '@/src/database/transactions/getTransactionById';
import { useDatabase } from '@/src/hooks/useDatabase';
import { useScreenState } from '@/src/hooks/useScreenState';
import { ScreenStateEnum } from '@/src/enums/screenStates';
import { Loading } from '@/src/components/Loading';
import LottieView from 'lottie-react-native';
import { theme } from '@/src/styles/theme';
import { formatCurrency, formatDate } from '@/src/utils';
import { deleteTransaction } from '@/src/database/transactions/deleteTransaction';

export default function TransactionDetails() {
  const [transaction, setTransaction] = useState<Transaction>();
  const { database } = useDatabase();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    isScreenStateLoading,
    isScreenStateError,
    isScreenStateDefault,
    handleChangeScreenStateToDefault,
    handleChangeScreenStateToError,
    handleChangeScreenStateToLoading,
  } = useScreenState(ScreenStateEnum.LOADING);

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

  const handleClose = () => router.back();

  const handleEdit = () => {
    router.back();
    router.push(`/transactions/update/${transaction?.id}`);
  };

  async function handleDelete() {
    try {
      await deleteTransaction(database, transaction!);
      handleClose();
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
    <Container>
      <View style={styles.header}>
        <Button variant="ghost" Icon={X} style={styles.closeButton} onPress={handleClose} />
      </View>
      {isScreenStateDefault && (
        <View style={styles.content}>
          <View>
            <Typography variant="title">
              {transaction?.name}{' '}
              {transaction?.installment &&
                transaction?.installment_qtd &&
                `${transaction?.installment}/${transaction?.installment_qtd}`}
            </Typography>
          </View>
          {transaction?.date && (
            <Typography variant="textSmall">
              {formatDate(transaction?.date, {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Typography>
          )}
          {transaction?.category && (
            <Typography variant="textSmall">Categoria: {transaction?.category}</Typography>
          )}

          {transaction?.amount && (
            <Typography variant="section" color={transaction?.type === 1 ? 'success' : 'error'}>
              {transaction?.type === 2 && '-'} {formatCurrency(transaction.amount)}
            </Typography>
          )}

          <View style={styles.actionsContainer}>
            <Button
              variant="secondary"
              title="Editar"
              Icon={Pen}
              style={[styles.actionItem]}
              onPress={handleEdit}
            />
            <Button
              variant="secondary"
              title="Apagar"
              Icon={Trash}
              style={[styles.actionItem]}
              onPress={confirmDelete}
            />
          </View>
        </View>
      )}
      {isScreenStateLoading && (
        <View style={styles.loadingOrErrorContainer}>
          <Loading />
        </View>
      )}
      {isScreenStateError && (
        <View style={styles.loadingOrErrorContainer}>
          <LottieView
            autoPlay
            style={theme.sizes.errorTransation}
            source={require('../../../assets/animations/error.json')}
            loop={false}
          />
          <Typography variant="section" style={styles.errorStateText}>
            Ocorreu um erro inesperado, por favor, tente novamente.
          </Typography>
          <Button variant="secondary" title="Fechar" onPress={handleClose} />
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    gap: theme.spacing.xs,
  },
  closeButton: {
    minHeight: 'auto',
    minWidth: 'auto',
  },
  loadingOrErrorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  errorStateText: {
    textAlign: 'center',
  },
  tagContainer: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
});

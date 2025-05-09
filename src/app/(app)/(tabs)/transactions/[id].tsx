import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { Typography } from '@/components/Typography';
import { deleteTransaction } from '@/database/transactions/deleteTransaction';
import { getTransactionById } from '@/database/transactions/getTransactionById';
import { Transaction } from '@/database/types';
import { ScreenStateEnum } from '@/enums/screenStates';
import { useDatabase } from '@/hooks/useDatabase';
import { useScreenState } from '@/hooks/useScreenState';
import { theme } from '@/styles/theme';
import { formatCurrency, formatDate } from '@/utils';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Pen, Trash } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { BotttomSheet, useBottomSheet } from '../../../../components/BottomSheet';

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

  const { isOpen, toggleSheet } = useBottomSheet(false);

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

  const handleClose = (haveChange?: boolean) => {
    toggleSheet();

    setTimeout(() => {
      router.back();
      router.setParams({
        update: !!haveChange,
      } as any);
    }, 500);
  };

  const handleEdit = () => {
    router.back();
    router.push(`/transactions/update/${transaction?.id}`);
  };

  async function handleDelete() {
    try {
      await deleteTransaction(database, transaction!);
      handleClose(true);
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

  useEffect(() => {
    toggleSheet();
  }, []);

  return (
    <BotttomSheet isOpen={isOpen} containerHeight={300} onClose={handleClose}>
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
            source={{ uri: 'error-animation' }}
            loop={false}
          />
          <Typography variant="section" style={styles.errorStateText}>
            Ocorreu um erro inesperado, por favor, tente novamente.
          </Typography>
          <Button variant="secondary" title="Fechar" onPress={handleClose} />
        </View>
      )}
    </BotttomSheet>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  dateModalContainer: {
    padding: theme.spacing.md,
  },
  dateContent: {
    gap: theme.spacing.xs,
  },
  dateContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  container: {},
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

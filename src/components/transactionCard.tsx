import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import { theme } from '../styles/theme';
import { Transaction } from '../database/types';
import { Typography } from './Typography';
import { formatCurrency, formatDate } from '../utils';
import { ArrowDown, ArrowUp, PenLine, Trash } from 'lucide-react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { deleteTransaction } from '../database/transactions/deleteTransaction';

import { SQLiteDatabase } from 'expo-sqlite';
import { router } from 'expo-router';
interface TransactionCardProps {
  transaction: Transaction;
  database: SQLiteDatabase;
  refetch: () => void;
}

export const TransactionCard = ({ transaction, database, refetch }: TransactionCardProps) => {
  const isEntry = transaction.type === 1;

  const date = formatDate(transaction.date);

  async function handleDelete() {
    try {
      await deleteTransaction(database, transaction);
      Alert.alert('Transação deletada com sucesso!');
      refetch?.();
    } catch (error) {
      console.log(error);
      Alert.alert('Ocorreu um erro inesperado', JSON.stringify(error));
    }
  }

  function confirmDelete() {
    Alert.alert(`Tem certeza que deseja apagar esta transação: ${transaction.name} `, '', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Apagar',
        onPress: handleDelete,
      },
    ]);
  }

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 50 }],
      };
    });

    return (
      <Reanimated.View style={[styleAnimation]}>
        <Pressable style={styles.deleteButton} onPress={confirmDelete}>
          <Trash color={theme.colors.error} />
        </Pressable>
      </Reanimated.View>
    );
  }

  function LeftAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value - 50 }],
      };
    });

    return (
      <Reanimated.View style={[styleAnimation]}>
        <Pressable
          style={styles.editButton}
          onPress={() => router.navigate(`/transactions/update/${transaction.id}`)}>
          <PenLine />
        </Pressable>
      </Reanimated.View>
    );
  }

  return (
    <Swipeable
      friction={2}
      leftThreshold={40}
      rightThreshold={40}
      enableTrackpadTwoFingerGesture
      renderRightActions={RightAction}
      renderLeftActions={LeftAction}
      containerStyle={styles.swipeableContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Typography>
            {isEntry ? (
              <ArrowUp color={theme.colors.success} />
            ) : (
              <ArrowDown color={theme.colors.error} />
            )}
          </Typography>

          <View>
            <Typography variant="section">
              {transaction.name}{' '}
              {transaction.installment &&
                transaction.installment_qtd &&
                `${transaction.installment}/${transaction.installment_qtd}`}
            </Typography>
            <Typography variant="textSmall">{date}</Typography>
          </View>
        </View>

        <Typography color={isEntry ? 'success' : 'error'} style={styles.amount}>
          {formatCurrency(transaction.amount)}
        </Typography>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.sizes.card,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  amount: {
    marginLeft: 'auto',
  },

  swipeableContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.lg,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 50,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 50,
  },
});

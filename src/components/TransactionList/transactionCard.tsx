import { ArrowDown, ArrowUp } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Transaction } from '../../database/types';
import { theme } from '../../styles/theme';
import { formatCurrency, formatDate } from '../../utils';
import { Typography } from '../Typography';

import { router } from 'expo-router';
interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const isEntry = transaction.type === 1;

  const date = formatDate(transaction.date);

  function handleGoToDetails() {
    router.navigate(`transactions/${transaction.id}` as any);
  }

  return (
    <TouchableOpacity style={styles.swipeableContainer} onPress={handleGoToDetails}>
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
            <View style={styles.titleContainer}>
              <Typography variant="text" weight="title">
                {transaction.name}{' '}
                {transaction.installment &&
                  transaction.installment_qtd &&
                  `${transaction.installment}/${transaction.installment_qtd}`}
              </Typography>
            </View>

            <Typography variant="textSmall">{date}</Typography>
          </View>
        </View>

        <Typography color={isEntry ? 'success' : 'error'} style={styles.amount}>
          {!isEntry && '- '}
          {formatCurrency(transaction.amount)}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

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
    borderWidth: 1,
    borderColor: theme.colors.border,
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

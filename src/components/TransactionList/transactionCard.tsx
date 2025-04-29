import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { theme } from '../../styles/theme';
import { Transaction } from '../../database/types';
import { Typography } from '../Typography';
import { formatCurrency, formatDate } from '../../utils';
import { ArrowDown, ArrowUp } from 'lucide-react-native';

import { router } from 'expo-router';
interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const isEntry = transaction.type === 1;

  const date = formatDate(transaction.date);

  function handleGoToDetails() {
    router.navigate(`transactions/${transaction.id}`);
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
              <Typography variant="section">
                {transaction.name}{' '}
                {transaction.installment &&
                  transaction.installment_qtd &&
                  `${transaction.installment}/${transaction.installment_qtd}`}
              </Typography>
              {transaction.category && (
                <View style={styles.tagContainer}>
                  <Typography variant="textSmall">{transaction.category}</Typography>
                </View>
              )}
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
  tagContainer: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.spacing.md,
    backgroundColor: theme.colors.surface,
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

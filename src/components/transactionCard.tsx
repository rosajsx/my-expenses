import { StyleSheet, View } from 'react-native';
import { theme } from '../styles/theme';
import { Transaction } from '../database/types';
import { Typography } from './Typography';
import { formatCurrency } from '../utils';
import { ArrowDown, ArrowUp } from 'lucide-react-native';

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const isEntry = transaction.type === 1;

  return (
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
          <Typography variant="textSmall">{transaction.date}</Typography>
        </View>
      </View>

      <Typography color={isEntry ? 'success' : 'error'} style={styles.amount}>
        {formatCurrency(transaction.amount)}
      </Typography>
    </View>
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
});

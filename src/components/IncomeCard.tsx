import { StyleSheet, View } from 'react-native';
import { theme } from '../styles/theme';
import { Income } from '../database/types';
import { Typography } from './Typography';
import { formatCurrency } from '../utils';
import { ArrowDown, ArrowUp } from 'lucide-react-native';

interface IncomeCardProps {
  income: Income;
}

export const IncomeCard = ({ income }: IncomeCardProps) => {
  const isEntry = income.type === 1;

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
            {income.name}{' '}
            {income.installment &&
              income.installmentQtd &&
              `${income.installment}/${income.installmentQtd}`}
          </Typography>
          <Typography variant="textSmall">{income.date}</Typography>
        </View>
      </View>

      <Typography color={isEntry ? 'success' : 'error'} style={styles.amount}>
        {formatCurrency(income.amount)}
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

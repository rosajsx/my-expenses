import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '../styles/theme';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react-native';
import { Typography } from './Typography';

interface TransactionTypeSwitchProps {
  initialValue?: number;
  onSelect: (value: number) => void;
}

export const TransactionTypeSwitch = ({
  initialValue = 0,
  onSelect,
}: TransactionTypeSwitchProps) => {
  const [transactionType, setTransactionType] = useState<number>(initialValue);

  return (
    <View style={styles.switchContainer}>
      <Pressable
        style={[
          styles.switchButton,
          styles.enterIcomeButton,
          transactionType === 1 && styles.enterIncomeSelected,
        ]}
        onPress={() => {
          setTransactionType(1);
          onSelect(1);
        }}>
        <ArrowBigUp color={theme.colors.success} fill={theme.colors.success} />
        <Typography>Entrada</Typography>
      </Pressable>
      <Pressable
        style={[
          styles.switchButton,
          styles.outIncomeButton,
          transactionType === 2 && styles.outIncomeSelected,
        ]}
        onPress={() => {
          setTransactionType(2);
          onSelect(2);
        }}>
        <ArrowBigDown color={theme.colors.error} fill={theme.colors.error} />
        <Typography>Saida</Typography>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  switchButton: {
    flex: 1,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterIcomeButton: {
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    borderTopLeftRadius: theme.radius.xl,
    borderBottomLeftRadius: theme.radius.xl,
  },
  outIncomeButton: {
    borderTopRightRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
  },
  enterIncomeSelected: {
    backgroundColor: theme.colors.success50,
  },
  outIncomeSelected: {
    backgroundColor: theme.colors.error50,
  },
});

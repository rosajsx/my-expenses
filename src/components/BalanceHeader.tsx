import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/styles/theme';
import { Typography } from './Typography';
import { useBoundStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { ScreenStateEnum } from '@/enums/screenStates';
import { formatCurrency, getAllMonthsOfYear } from '@/utils';
import { SQLiteDatabase } from 'expo-sqlite';
import { useDatabase } from '@/hooks/useDatabase';
import { Plus, RefreshCcw, RotateCw } from 'lucide-react-native';
import { Button } from './Button';
import { router } from 'expo-router';
import { Loading } from './Loading';
import Animated from 'react-native-reanimated';

interface BalanceHeaderProps {
  db?: SQLiteDatabase;
  onPressSync?: () => void;
  canSync?: boolean;
  isSyncing?: boolean;
}

const AnimatedButton = Animated.createAnimatedComponent(Button);

const currentMonth = new Date().getMonth();
const months = getAllMonthsOfYear();

export const BalanceHeader = ({ db, onPressSync, canSync, isSyncing }: BalanceHeaderProps) => {
  const { balance, monthBalance, balanceInView, toggleBalanceInView, getBalances, balancesState } =
    useBoundStore(
      useShallow((state) => ({
        balance: state.balance,
        monthBalance: state.monthBalance,
        balanceInView: state.balanceInView,
        toggleBalanceInView: state.toggleBalanceView,
        getBalances: state.getBalances,
        balancesState: state.balanceState,
      })),
    );

  const { database } = db ? { database: db } : useDatabase();

  return (
    <View style={styles.headerContainer}>
      <View>
        <Pressable style={styles.balanceHeader} onPress={toggleBalanceInView}>
          <Typography variant="subtitle">
            {balanceInView === 'GENERAL' ? 'Saldo total:' : `Saldo ${months[currentMonth].value}`}
          </Typography>

          {balancesState === ScreenStateEnum.DEFAULT && (
            <Typography variant="subtitle" color={balance < 0 ? 'error' : 'textPrimary'}>
              {balanceInView === 'GENERAL' ? formatCurrency(balance) : formatCurrency(monthBalance)}
            </Typography>
          )}
        </Pressable>
        <Typography variant="label">Toque no saldo para mudar a visualização</Typography>

        {balancesState === ScreenStateEnum.LOADING && <Loading size="sm" />}
        {balancesState === ScreenStateEnum.ERROR && (
          <Button Icon={RotateCw} variant="secondary" onPress={() => getBalances(database)} />
        )}
      </View>
      <View style={styles.subHeader}>
        <Button
          Icon={Plus}
          onPress={() => router.navigate('/transactions/create')}
          title="Nova Transação"
          style={styles.addButton}
          variant="secondary"
        />
        <Button
          Icon={RefreshCcw}
          onPress={onPressSync}
          title={isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          style={[styles.addButton, !canSync && { opacity: 0 }]}
          variant="secondary"
          disabled={isSyncing || !canSync}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  addButton: {
    flexDirection: 'row',
    flex: 1,
    gap: theme.spacing.sm,
    maxWidth: 180,
  },
  headerContainer: {
    gap: theme.spacing.lg,
  },
  subHeader: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
});

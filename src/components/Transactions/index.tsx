import { ITransaction, TransactionComposed } from '@/store/transactions/transactions.types';
import { colors } from '@/styles/colors';
import { formatCurrency, formatDate } from '@/utils';
import { router } from 'expo-router';
import { Pen, Trash } from 'lucide-react-native';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Loading } from '../Loading';
import { Separator } from '../Separator';
import { Typography } from '../Typography';

interface TransactionsProps {
  data: TransactionComposed[];
  isLoading?: boolean;
  onDelete?: (transaction: ITransaction) => void;
}

export const Transactions = ({ data, isLoading, onDelete }: TransactionsProps) => {
  const RightAction = (
    prog: SharedValue<number>,
    drag: SharedValue<number>,
    transaction: ITransaction,
  ) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 80 }],
      };
    });
    return (
      <Reanimated.View style={[styleAnimation, styles.rightAction]}>
        <TouchableOpacity style={styles.rightActionBtn} onPress={() => onDelete?.(transaction)}>
          <Trash color={colors.backgroundWhite} size={24} />
          <Text style={styles.rightActionText}>Apagar</Text>
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  const LeftAction = (
    prog: SharedValue<number>,
    drag: SharedValue<number>,
    transaction: ITransaction,
  ) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value - 82 }],
      };
    });
    return (
      <Reanimated.View style={[styleAnimation, styles.leftAction]}>
        <TouchableOpacity
          style={styles.rightActionBtn}
          onPress={() => router.navigate(`/private/transactions/update/${transaction?.id}`)}>
          <Pen color={colors.backgroundWhite} size={24} />
          <Text style={styles.rightActionText}>Editar</Text>
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  return (
    <FlatList
      data={data || []}
      bounces={false}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <Separator />}
      ListEmptyComponent={() => (
        <View>
          {isLoading ? (
            <View style={styles.center}>
              <Loading />
            </View>
          ) : (
            <Typography variant="body/md" align="center">
              Nenhuma transação encontrada!
            </Typography>
          )}
        </View>
      )}
      renderItem={({ item }) => (
        <ReanimatedSwipeable
          friction={2}
          enableTrackpadTwoFingerGesture
          rightThreshold={40}
          renderLeftActions={(prag, drag) => LeftAction(prag, drag, item as any)}
          renderRightActions={(prag, drag) => RightAction(prag, drag, item as any)}>
          <Pressable
            style={styles.transactionCard}
            onPress={() => router.push(`/private/transactions/${item.id}`)}>
            <View style={styles.transactionContent}>
              <Typography variant="heading/sm">
                {item.name}{' '}
                {item.installment &&
                  item.installment_qtd &&
                  `${item.installment}/${item.installment_qtd}`}
              </Typography>

              {item.date && <Typography variant="body/sm">{formatDate(item.date)}</Typography>}
              {item.is_fixed && (
                <Typography variant="body/sm" color="primary">
                  Fixo/Recorrente
                </Typography>
              )}
            </View>
            <View style={styles.transactionAmountContent}>
              <Typography variant="heading/sm" color={item.type === 1 ? 'text' : 'red'}>
                {item.type !== 1 && '-'} {formatCurrency(item.amount)}
              </Typography>
              <Typography variant="body/sm">{item?.categories?.name}</Typography>
            </View>
          </Pressable>
        </ReanimatedSwipeable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listContainer: {
    maxHeight: '88%',
    paddingBottom: 50,
  },
  rightAction: {
    width: 80,
    height: '100%',
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  leftAction: {
    width: 80,
    height: '100%',
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  rightActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  rightActionText: {
    color: colors.white,
    fontFamily: 'Inter_500Medium',
    fontWeight: 500,
    fontSize: 14,
  },

  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingRight: 4,
  },
  transactionContent: {
    gap: 4,
  },
  transactionAmountContent: {
    gap: 4,
    alignItems: 'flex-end',
  },

  content: {
    gap: 16,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

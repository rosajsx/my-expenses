import { Container } from '@/components/Container';
import { Header } from '@/components/Header';
import { Typography } from '@/components/Typography';
import { useDatabase } from '@/hooks/useDatabase';
import { useBoundStore } from '@/store';
import { theme } from '@/styles/theme';
import { formatCurrency } from '@/utils';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

const formatDate = (date: string): string => {
  const [ano, mes] = date.split('-');
  const data = new Date(Number(ano), Number(mes) - 1);
  return data.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
};

export default function Balances() {
  const { database } = useDatabase();

  const balances = useBoundStore((state) => state.balancePage.balances);
  const getBalances = useBoundStore((state) => state.balancePage.getBalances);
  const state = useBoundStore((state) => state.balancePage.state);

  useFocusEffect(
    useCallback(() => {
      getBalances(database);
    }, []),
  );

  return (
    <Container>
      <Header />
      <View style={styles.titleContainer}>
        <FlatList
          data={balances}
          keyExtractor={(item) => item.month}
          ListHeaderComponent={<Typography variant="title">Saldos</Typography>}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            return (
              <View style={styles.item}>
                <Typography variant="section">{formatDate(item.month)}</Typography>
                <Typography variant="section" color={item.total > 0 ? 'success' : 'error'}>
                  {formatCurrency(item.total)}
                </Typography>
              </View>
            );
          }}
        />
      </View>
      <View></View>
    </Container>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingVertical: theme.spacing.md,
  },
  listContainer: {
    gap: theme.spacing.md,
  },
  item: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: theme.sizes.card,
  },
});

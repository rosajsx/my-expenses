import { Container } from '@/components/Container';
import { Loading } from '@/components/Loading';
import { Typography } from '@/components/Typography';
import { useBalances } from '@/hooks/features/useBalances';
import { colors } from '@/styles/colors';
import { formatCurrency } from '@/utils';
import { SectionList, StyleSheet, View } from 'react-native';
export default function BalancesIndex() {
  const { balancesResponse } = useBalances();

  return (
    <Container style={styles.container}>
      {balancesResponse.isLoading || balancesResponse.isFetching ? (
        <View style={styles.loadingContainer}>
          <Loading />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Typography variant="heading/lg">Saldos</Typography>
            <View>
              <Typography>Total:</Typography>
              <Typography
                variant="heading/lg"
                color={balancesResponse?.data?.total! > 0 ? 'green' : 'red'}>
                {formatCurrency(balancesResponse.data?.total || 0)}
              </Typography>
            </View>
          </View>
          <SectionList
            sections={balancesResponse.data?.monthData || []}
            keyExtractor={(item, index) => (item.value + index).toString()}
            contentContainerStyle={styles.contentContainer}
            renderItem={({ item }) => (
              <View style={[styles.card]}>
                <Typography variant="heading/sm">{item.month.toUpperCase()}</Typography>
                <Typography variant="body/lg" color={item.value > 0 ? 'green' : 'red'}>
                  {formatCurrency(item.value)}
                </Typography>
              </View>
            )}
            renderSectionHeader={({ section }) => (
              <View style={[styles.sectionHeader, styles.padding]}>
                <Typography variant="heading/sm">{section.year}</Typography>
              </View>
            )}
            ListEmptyComponent={() => (
              <Typography variant="body/lg" color="gray">
                Nenhum saldo encontrado
              </Typography>
            )}
          />
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  header: {
    gap: 16,
  },
  contentContainer: {
    gap: 4,
  },
  card: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray,
  },
  sectionHeader: {
    paddingVertical: 8,
  },
  padding: {
    paddingHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

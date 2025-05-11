import { BotttomSheet, useBottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';
import { Typography } from '@/components/Typography';
import { ScreenStateEnum } from '@/enums/screenStates';
import { useDatabase } from '@/hooks/useDatabase';
import { useBoundStore } from '@/store';
import { theme } from '@/styles/theme';
import { formatCurrency, getLastAndFoward5Years } from '@/utils';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Calendar, Filter } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

const years = getLastAndFoward5Years();

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

  const filteredBalances = useBoundStore((state) => state.balancePage.filteredBalances);

  const getBalances = useBoundStore((state) => state.balancePage.getBalances);
  const state = useBoundStore((state) => state.balancePage.state);
  const isSelectYearOpen = useBoundStore((state) => state.balancePage.isSelectYearOpen);
  const toggleSelectYearOpen = useBoundStore((state) => state.balancePage.toggleSelectYearOpen);
  const selectedYear = useBoundStore((state) => state.balancePage.selectedYear);
  const setSelectedYear = useBoundStore((state) => state.balancePage.setSelectedYear);
  const filterBalance = useBoundStore((state) => state.balancePage.getFilteredBalances);
  const clearFilters = useBoundStore((state) => state.balancePage.clearFilters);

  const { isOpen, toggleSheet } = useBottomSheet();

  const handleClose = () => {
    toggleSelectYearOpen();
    toggleSheet();
  };

  useEffect(() => {
    isOpen.value = isSelectYearOpen;
  }, [isSelectYearOpen]);

  useFocusEffect(
    useCallback(() => {
      getBalances(database);
    }, []),
  );

  return (
    <>
      <Container>
        <Header />
        <FlatList
          data={filteredBalances}
          style={styles.list}
          keyExtractor={(item) => item.month}
          showsVerticalScrollIndicator={false}
          bounces={false}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={
            <View style={styles.header}>
              <Typography variant="title">Saldos</Typography>
              <View style={styles.filterItems}>
                <TouchableOpacity style={styles.filterItem} onPress={toggleSelectYearOpen}>
                  <Calendar color={theme.colors.textSecondary} size="20px" />
                  <Typography>{selectedYear ? selectedYear : 'Ano'}</Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterItem, !selectedYear && styles.opacity]}
                  disabled={!selectedYear}
                  onPress={clearFilters}>
                  <Filter color={theme.colors.textSecondary} size="20px" />
                  <Typography>Limpar filtros</Typography>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.filterItem, !selectedYear && styles.opacity]}
                disabled={!selectedYear}
                onPress={filterBalance}>
                <Filter color={theme.colors.textSecondary} size="20px" />
                <Typography>Filtrar</Typography>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={[styles.listContainer]}
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
          ListEmptyComponent={
            <View style={[styles.flex, styles.center]}>
              {state === ScreenStateEnum.ERROR && (
                <View style={[styles.center, styles.errorContainer]}>
                  <LottieView
                    autoPlay
                    style={theme.sizes.errorTransation}
                    source={{
                      uri: '../../../../../assets/animations/error.json',
                    }}
                    loop={false}
                  />
                  <Typography variant="section" style={styles.textCenter}>
                    Ocorreu um erro inesperado, por favor, tente novamente.
                  </Typography>

                  <Button title="Recarregar" onPress={() => getBalances(database)} />
                </View>
              )}
              {state === ScreenStateEnum.LOADING && (
                <View style={[styles.center]}>
                  <Loading />
                </View>
              )}

              {state === ScreenStateEnum.DEFAULT && (
                <View style={[styles.center]}>
                  <LottieView
                    autoPlay
                    style={theme.sizes.emptyTransaction}
                    source={require('../../../../../assets/animations/empty.json')}
                    loop={false}
                  />
                  <Typography variant="section">Nenhuma despesa encontrada.</Typography>
                </View>
              )}
            </View>
          }
        />
      </Container>

      <BotttomSheet isOpen={isOpen} toggleSheet={handleClose}>
        <View>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(value) => {
              setSelectedYear(value);
            }}>
            <Picker.Item label="Todos" value={undefined} />
            {years.map((year) => (
              <Picker.Item key={year} label={`${year}`} value={year} />
            ))}
          </Picker>
        </View>
      </BotttomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingVertical: theme.spacing.md,
  },
  list: {
    height: '100%',
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
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  emptyContainer: {},
  errorContainer: {
    gap: theme.spacing.md,
  },
  filterItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    width: '100%',
  },
  filterItem: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardBackground,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,

    borderRadius: theme.radius.lg,
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  opacity: {
    opacity: 0.5,
  },
});

import { Container } from '@/components/Container';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';
// import { BottomSheet, useBottomSheet } from '@/components/Sheets/BottomSheet';
import { Typography } from '@/components/Typography';
//import { BalanceType } from '@/database/balances/getBalancePerMonth';
import { ScreenStateEnum } from '@/enums/screenStates';
//import { useDatabase } from '@/hooks/useDatabase';
import { useBoundStore } from '@/store';
import { getLastAndForward5Years } from '@/utils';
import { useFocusEffect } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

const years = getLastAndForward5Years();

const formatDate = (date: string): string => {
  const [ano, mes] = (date || '').split('-');
  const data = new Date(Number(ano), Number(mes) - 1);
  return data.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
};

export default function Balances() {
  // const { database } = useDatabase();

  const filteredBalances = useBoundStore((state) => state.balancePage.filteredBalances);

  const getBalances = useBoundStore((state) => state.balancePage.getBalances);
  const state = useBoundStore((state) => state.balancePage.state);
  const isSelectYearOpen = useBoundStore((state) => state.balancePage.isSelectYearOpen);
  const toggleSelectYearOpen = useBoundStore((state) => state.balancePage.toggleSelectYearOpen);
  const selectedYear = useBoundStore((state) => state.balancePage.selectedYear);
  const setSelectedYear = useBoundStore((state) => state.balancePage.setSelectedYear);
  const filterBalance = useBoundStore((state) => state.balancePage.getFilteredBalances);
  const clearFilters = useBoundStore((state) => state.balancePage.clearFilters);
  const selectedItem = useBoundStore((state) => state.balancePage.selectedItem);
  const setSelectedItem = useBoundStore((state) => state.balancePage.setSelectedItem);

  // const { isOpen, toggleSheet } = useBottomSheet();
  // const { isOpen: IsDetailsOpen, toggleSheet: toggleDetailsSheet } = useBottomSheet();

  const handleClose = () => {
    toggleSelectYearOpen();
    //toggleSheet();
  };

  const handleSelectItem = (item: BalanceType) => {
    setSelectedItem(item);
    setTimeout(() => {
      // toggleDetailsSheet();
    }, 500);
  };

  useEffect(() => {
    // isOpen.value = isSelectYearOpen;
  }, [isSelectYearOpen]);

  useFocusEffect(
    useCallback(() => {
      //    getBalances(database);
    }, []),
  );

  return (
    <>
      <Container>
        <Header />
        <View>
          <FlatList
            data={filteredBalances}
            style={styles.list}
            keyExtractor={(item) => item.month}
            showsVerticalScrollIndicator={false}
            bounces={false}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <View style={styles.header}>
                {/* <Typography variant="title">Saldos</Typography> */}
                <View style={styles.filterItems}>
                  <TouchableOpacity style={styles.filterItem} onPress={toggleSelectYearOpen}>
                    {/* <Calendar color={theme.colors.textSecondary} size="20px" /> */}
                    <Typography>{selectedYear ? selectedYear : 'Ano'}</Typography>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.filterItem, !selectedYear && styles.opacity]}
                    disabled={!selectedYear}
                    onPress={clearFilters}>
                    {/* <Filter color={theme.colors.textSecondary} size="20px" /> */}
                    <Typography>Limpar filtros</Typography>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[styles.filterItem, !selectedYear && styles.opacity]}
                  disabled={!selectedYear}
                  onPress={filterBalance}>
                  {/* <Filter color={theme.colors.textSecondary} size="20px" /> */}
                  <Typography>Filtrar</Typography>
                </TouchableOpacity>
              </View>
            }
            contentContainerStyle={[styles.listContainer]}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity style={styles.item} onPress={() => handleSelectItem(item)}>
                  {/* <Typography variant="section">{formatDate(item.month)}</Typography>
                  <Typography variant="section" color={item.total > 0 ? 'success' : 'error'}>
                    {formatCurrency(item.total)}
                  </Typography> */}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={[styles.flex, styles.center]}>
                {state === ScreenStateEnum.ERROR && (
                  <View style={[styles.center, styles.errorContainer]}>
                    <LottieView
                      autoPlay
                      // style={theme.sizes.errorTransation}
                      source={{
                        uri: '../../../../../assets/animations/error.json',
                      }}
                      loop={false}
                    />
                    {/* <Typography variant="section" style={styles.textCenter}>
                      Ocorreu um erro inesperado, por favor, tente novamente.
                    </Typography> */}

                    {/* <Button title="Recarregar" onPress={() => getBalances(database)} /> */}
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
                      // style={theme.sizes.emptyTransaction}
                      source={require('../../../../../assets/animations/empty.json')}
                      loop={false}
                    />
                    {/* <Typography variant="section">Nenhuma despesa encontrada.</Typography> */}
                  </View>
                )}
              </View>
            }
          />
        </View>
      </Container>

      {/* <BottomSheet isOpen={isOpen} toggleSheet={handleClose}>
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
      </BottomSheet>

      <BottomSheet
        title={formatDate(selectedItem?.month!)}
        isOpen={IsDetailsOpen}
        toggleSheet={toggleDetailsSheet}>
        <View style={styles.detailsWrapper}>
          <View style={styles.detailsTotalContainer}>
            <Typography variant="section">Total:</Typography>
            <Typography variant="section" color={selectedItem?.total! < 0 ? 'error' : 'success'}>
              {formatCurrency(selectedItem?.total!)}
            </Typography>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <ArrowBigUp fill="green" color="green" size={28} />
              <View>
                <Typography>Entradas</Typography>

                <Typography>{formatCurrency(selectedItem?.total_in!)}</Typography>
              </View>
            </View>

            <View style={styles.detailItem}>
              <ArrowBigDown fill="red" color="red" size={28} />
              <View>
                <Typography>Saidas</Typography>
                <Typography>{formatCurrency(selectedItem?.total_out!)}</Typography>
              </View>
            </View>
          </View>
        </View>
      </BottomSheet> */}
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    // paddingVertical: theme.spacing.md,
  },
  list: {
    // height: '100%',
  },
  listContainer: {
    // gap: theme.spacing.md,
    // paddingBottom: theme.spacing.xl,
  },

  item: {
    // backgroundColor: theme.colors.cardBackground,
    // borderRadius: theme.radius.lg,
    // padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // height: theme.sizes.card,
    borderWidth: 1,
    // borderColor: theme.colors.border,
  },
  flex: {
    flex: 1,
  },
  header: {
    // paddingVertical: theme.spacing.md,
    // gap: theme.spacing.md,
    // backgroundColor: theme.colors.background,
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
    // gap: theme.spacing.md,
  },
  filterItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // gap: theme.spacing.sm,
    width: '100%',
  },
  filterItem: {
    flexDirection: 'row',
    // gap: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: theme.colors.cardBackground,
    // paddingHorizontal: theme.spacing.lg,
    // paddingVertical: theme.spacing.sm,

    // borderRadius: theme.radius.lg,
    flex: 1,
    borderWidth: 1,
    // borderColor: theme.colors.border,
  },
  opacity: {
    opacity: 0.5,
  },

  detailsWrapper: {
    // gap: theme.spacing.md,
  },

  detailsContainer: {
    flexDirection: 'row',
    // gap: theme.spacing.md,
  },

  detailsTotalContainer: {
    flexDirection: 'row',
    // gap: theme.spacing.md,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: theme.colors.background,
    // padding: theme.spacing.lg,
    // borderRadius: theme.radius.lg,
    // gap: theme.spacing.md,
    width: '50%',
    borderWidth: 1,
    // borderColor: theme.colors.border,
  },
});

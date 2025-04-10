import { FlatList, StyleSheet } from 'react-native';
import { Container } from '../components/Container';
import { Typography } from '../components/Typography';
import { useDatabase } from '../hooks/useDatabase';
import { useEffect, useState } from 'react';
import { Income } from '../database/types';
import { getIncomes } from '../database/incomes/getIncomes';
import { theme } from '../styles/theme';

import { IncomeCard } from '../components/IncomeCard';

export default function Index() {
  const [data, setData] = useState<Income[]>([]);
  const { database } = useDatabase();

  useEffect(() => {
    getIncomes(database)
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, []);

  // createIncome(database, {
  //   name: 'Salário',
  //   amount: 5000,
  //   type: 1,
  //   date: new Date().toDateString(),
  //   installment: null,
  //   installmentQtd: null,
  // })
  //   .then(() => console.log('created 1'))
  //   .catch((error) => console.log('1', error));

  // createIncome(database, {
  //   name: 'Pix',
  //   amount: 2000,
  //   type: 2,
  //   date: new Date().toDateString(),
  //   installment: null,
  //   installmentQtd: null,
  // })
  //   .then(() => console.log('created 2'))
  //   .catch((error) => console.log('2', error));

  // createIncome(database, {
  //   name: 'Boleto',
  //   amount: 1000,
  //   type: 2,
  //   date: new Date().toDateString(),
  //   installment: 3,
  //   installmentQtd: 5,
  // })
  //   .then(() => console.log('created 3'))
  //   .catch((error) => console.log('3', error));

  return (
    <Container>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(list) => <IncomeCard income={list.item} />}
        ListHeaderComponent={<Typography variant="title">Extrato</Typography>}
        ListHeaderComponentStyle={styles.header}
        stickyHeaderIndices={[0]}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        getItemLayout={(data, index) => ({
          length: theme.sizes.card,
          offset: theme.sizes.card * index,
          index,
        })}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background,
  },
  list: {
    height: '100%',
  },
  contentContainer: {
    gap: theme.spacing.lg,
  },
});

import { Button, Text, View } from 'react-native';
import { Container } from '../components/Container';
import { Typography } from '../components/Typography';
import { useDatabase } from '../hooks/useDatabase';
import { useEffect, useState } from 'react';
import { Income } from '../database/types';
import { getIncomes } from '../database/incomes/getIncomes';

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

  return (
    <Container>
      <Typography variant="title">Extrato</Typography>
      {data.map((item) => {
        return (
          <View key={item.id}>
            <Typography>{item.name}</Typography>
            <Typography>{item.amount}</Typography>
            <Typography>{item.type === 1 ? 'Entrada' : 'Saída'}</Typography>
            {item.installment && <Typography>{item.installment}</Typography>}
            <Typography>{item.date}</Typography>
            <Typography>--------------</Typography>
          </View>
        );
      })}
    </Container>
  );
}

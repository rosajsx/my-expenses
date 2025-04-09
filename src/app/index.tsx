import { Text } from 'react-native';
import { Container } from '../components/Container';
import { Typography } from '../components/Typography';

export default function Index() {
  return (
    <Container>
      <Typography variant="title">Texto title</Typography>
      <Typography variant="subtitle">Texto subtitle</Typography>
      <Typography variant="section">Texto section</Typography>
      <Typography variant="text">Texto normal</Typography>
      <Typography variant="textSmall">Texto textSmall</Typography>
      <Typography variant="label">Texto label</Typography>
    </Container>
  );
}

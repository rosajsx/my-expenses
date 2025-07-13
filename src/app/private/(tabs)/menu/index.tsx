import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Loading } from '@/components/Loading';
import { useMenu } from '@/hooks/features/useMenu';
import { StyleSheet, View } from 'react-native';

export default function Menu() {
  const { handleSignOut, isLoading } = useMenu();

  return (
    <Container>
      <View style={styles.wrapper}>
        {isLoading ? (
          <Loading />
        ) : (
          <Button variant="primary" title="Sair" style={styles.button} onPress={handleSignOut} />
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
});

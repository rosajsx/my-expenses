import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Input } from '@/components/Input';
import { Loading } from '@/components/Loading';
import { Typography } from '@/components/Typography';
import { useBoundStore } from '@/store';
import { theme } from '@/styles/theme';
import { router } from 'expo-router';
import { Link } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [hash, setHash] = useState<string>();
  const setAuthHash = useBoundStore((state) => state.setAuthHash);
  const createAuthHash = useBoundStore((state) => state.createAuthHash);

  const handleSubmit = async (haveHash = true) => {
    setIsLoading(true);
    if (!!hash && haveHash) {
      await setAuthHash(hash);
    } else {
      await createAuthHash();
    }
    setTimeout(() => {
      router.replace('/');
    }, 2000);
  };

  return (
    <Container style={styles.center}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View style={styles.titleContainer}>
            <Typography variant="title" color="primary" style={styles.title}>
              Bem vindo ao, MyExpenses
            </Typography>
            <Typography variant="section" style={styles.title} color="textSecondary">
              Entre com seu ID de usuário
            </Typography>
          </View>
          <View style={styles.inputContainer}>
            <Input
              value={hash}
              onChangeText={setHash}
              placeholder="ID usuário"
              LeftIcon={Link}
              returnKeyType="done"
              onSubmitEditing={() => handleSubmit(true)}
            />
            <Button
              title="Entrar"
              disabled={!hash}
              style={styles.submit}
              onPress={() => handleSubmit(true)}
            />
            <Button
              title="Não possuo ID"
              style={styles.dontHaveID}
              variant="ghost"
              fontWeight="title"
              onPress={() => handleSubmit(false)}
            />
          </View>
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xl,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  title: {
    textAlign: 'center',
  },

  inputContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  submit: {
    width: '100%',
  },
  dontHaveID: {
    width: '100%',
  },
});

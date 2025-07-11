import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { InputColumn } from '@/components/Input/InputColumn';
import { Loading } from '@/components/Loading';
import { Separator } from '@/components/Separator';
import { Typography } from '@/components/Typography';
import { colors } from '@/styles/colors';
import { Image, StyleSheet, View } from 'react-native';

import { useSignIn } from '@/hooks/features/useSignIn';
import { Redirect, router } from 'expo-router';

export default function SignIn() {
  const { session, isLoading, error, email, setEmail, password, setPassword, handleSubmit } =
    useSignIn();

  if (session) {
    return <Redirect href="/private" />;
  }

  return (
    <Container style={styles.center}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View style={styles.titleContainer}>
            <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
            <Typography variant="heading/lg">Bem vindo ao MyExpenses</Typography>
          </View>
          <Card>
            <InputColumn
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Separator />
            <InputColumn
              placeholder="Digite sua senha"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
          </Card>
          {error && (
            <Typography variant="body/sm" color="red" align="center">
              {error}
            </Typography>
          )}
          <Button title="Entrar" onPress={handleSubmit} />
          <Button
            variant="ghost"
            title="Não possuo cadastro"
            onPress={() => router.push('/sign-up')}
          />
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.separator,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    textAlign: 'center',
  },

  inputContainer: {
    width: '100%',
    gap: 24,
  },
  submit: {
    width: '100%',
  },
  dontHaveID: {
    width: '100%',
  },
});

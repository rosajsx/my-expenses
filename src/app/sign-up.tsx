import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { InputColumn } from '@/components/Input/InputColumn';
import { Loading } from '@/components/Loading';
import { Separator } from '@/components/Separator';
import { Typography } from '@/components/Typography';
import { useSignUp } from '@/hooks/features/useSignUp';
import { colors } from '@/styles/colors';
import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeClosed } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

export default function SignUp() {
  const {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    error,
    confirmPassword,
    setConfirmPassword,
    isConfirmPasswordVisible,
    isPasswordVisible,
    setIsConfirmPasswordVisible,
    setIsPasswordVisible,
    isSubmitDisabled,
    session,
  } = useSignUp();

  return (
    <Container>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Loading />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Button variant="ghost" onPress={router.back}>
              <ArrowLeft color={colors.primary} />
            </Button>
          </View>
          <View style={styles.content}>
            <Typography variant="heading/lg" align="center">
              Digite seu melhor e-mail e escolha uma boa senha!
            </Typography>
            <Card>
              <InputColumn
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </Card>
            <Card>
              <InputColumn
                placeholder="Digite sua senha"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                Icon={isPasswordVisible ? Eye : EyeClosed}
                iconAction={() =>
                  isPasswordVisible ? setIsPasswordVisible(false) : setIsPasswordVisible(true)
                }
              />
              <Separator />
              <InputColumn
                placeholder="Confirme sua senha"
                secureTextEntry={!isConfirmPasswordVisible}
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                Icon={isConfirmPasswordVisible ? Eye : EyeClosed}
                iconAction={() =>
                  isConfirmPasswordVisible
                    ? setIsConfirmPasswordVisible(false)
                    : setIsConfirmPasswordVisible(true)
                }
              />
            </Card>
            {error && (
              <Typography variant="body/sm" color="red" align="center">
                {error}
              </Typography>
            )}
          </View>

          <Button title="Cadastrar" onPress={handleSubmit} disabled={isSubmitDisabled} />
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

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
});

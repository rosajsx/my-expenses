import { Button } from '@/src/components/Button';
import { Container } from '@/src/components/Container';
import { Input } from '@/src/components/Input';
import { TransactionTypeSwitch } from '@/src/components/TransactionTypeSwitch';
import { Typography } from '@/src/components/Typography';
import { theme } from '@/src/styles/theme';
import { formatCurrency, parseCurrencyToCents } from '@/src/utils';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { DollarSign, X } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useScreenState } from '@/src/hooks/useScreenState';
import { useDatabase } from '@/src/hooks/useDatabase';
import { createTransaction } from '@/src/database/transactions/createTransaction';
import LottieView from 'lottie-react-native';
import { Loading } from '@/src/components/Loading';
import Animated, { FadeIn } from 'react-native-reanimated';
import { getTransactionById } from '@/src/database/transactions/getTransactionById';
import { updateTransaction } from '@/src/database/transactions/updateTransaction';

const AnimatedTypography = Animated.createAnimatedComponent(Typography);

export default function UpdateTransaction() {
  const [transactionName, setTransactionName] = useState('');
  const [transactionType, setTransactionType] = useState<number>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amount, setAmount] = useState(0);

  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    handleChangeScreenStateToError,
    handleChangeScreenStateToLoading,
    handleChangeScreenStateToSuccess,
    isScreenStateDefault,
    isScreenStateError,
    isScreenStateLoading,
    isScreenStateSuccess,
  } = useScreenState();
  const { database } = useDatabase();

  const currencyValueRef = useRef<TextInput>();

  const isUpdateButtonDisabled = !transactionType && !transactionName;

  const handleUpdateTransaction = () => {
    handleChangeScreenStateToLoading();

    updateTransaction(database, {
      name: transactionName,
      amount,
      id,
      type: transactionType!,
      date: selectedDate.toISOString(),
    })
      .then(() => {
        handleChangeScreenStateToSuccess();
      })
      .catch((error) => {
        console.log(error);
        handleChangeScreenStateToError();
      });
  };

  const getData = async () => {
    try {
      const data = await getTransactionById(database, id);

      if (data?.name) setTransactionName(data?.name);
      if (data?.amount) setAmount(data?.amount);
      if (data?.date) setSelectedDate(new Date(data?.date));
      if (data?.type) setTransactionType(data?.type);

      console.log({ data });
    } catch (error) {
      console.log('error');
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, []),
  );

  return (
    <Container>
      {isScreenStateDefault && (
        <KeyboardAvoidingView
          style={styles.avoidView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHeader}>
            <Typography>Nova Transação</Typography>
            <Button variant="ghost" Icon={X} onPress={router.back} />
          </View>
          <View style={styles.content}>
            <Input
              label="Nome"
              returnKeyType="next"
              value={transactionName}
              onChangeText={setTransactionName}
              onSubmitEditing={() => {
                currencyValueRef?.current?.focus?.();
              }}
            />
            <Input
              label="Valor"
              keyboardType="number-pad"
              LeftIcon={DollarSign}
              value={formatCurrency(amount)}
              onChangeText={(value) => {
                const cents = parseCurrencyToCents(value);
                setAmount(cents);
              }}
              ref={currencyValueRef}
              returnKeyType="next"
            />
            <TransactionTypeSwitch onSelect={setTransactionType} />

            <View>
              <Typography variant="label">Data</Typography>
              <DateTimePicker
                display="inline"
                mode="date"
                value={selectedDate}
                onChange={(_, date) => {
                  setSelectedDate(date!);
                }}
              />
            </View>
            <Button
              variant="primary"
              title="Atualizar"
              disabled={isUpdateButtonDisabled}
              onPress={handleUpdateTransaction}
            />
          </View>
        </KeyboardAvoidingView>
      )}

      {isScreenStateLoading && (
        <View style={styles.statesContainer}>
          <Loading />
        </View>
      )}
      {isScreenStateError && (
        <View style={styles.statesContainer}>
          <LottieView
            autoPlay
            style={theme.sizes.errorTransation}
            source={require('../../../../assets/animations/error.json')}
            loop={false}
          />
          <Typography variant="section" style={styles.errorStateText}>
            Ocorreu um erro inesperado, por favor, tente novamente.
          </Typography>
          <Button title="Fechar" onPress={router.back} />
        </View>
      )}

      {isScreenStateSuccess && (
        <View style={styles.statesContainer}>
          <LottieView
            autoPlay
            style={theme.sizes.errorTransation}
            source={require('../../../../assets/animations/success.json')}
          />

          <AnimatedTypography
            variant="section"
            style={styles.errorStateText}
            entering={FadeIn.duration(3800)}>
            Transação atualizada com sucesso!
          </AnimatedTypography>
          <Animated.View entering={FadeIn.duration(3800)} style={styles.buttonContainer}>
            <Button
              title="Fechar"
              variant="secondary"
              onPress={() => router.back()}
              style={styles.buttonStyle}
            />
          </Animated.View>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avoidView: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: theme.spacing.lg,
  },
  footer: {
    borderWidth: 1,
    borderColor: 'red',
  },
  switchContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  switchButton: {
    flex: 1,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterIcomeButton: {
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    borderTopLeftRadius: theme.radius.xl,
    borderBottomLeftRadius: theme.radius.xl,
  },
  outIncomeButton: {
    borderTopRightRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
  },
  enterIncomeSelected: {
    backgroundColor: theme.colors.success50,
  },
  outIncomeSelected: {
    backgroundColor: theme.colors.error50,
  },
  statesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  errorStateText: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  buttonStyle: {
    flex: 1,
  },
});

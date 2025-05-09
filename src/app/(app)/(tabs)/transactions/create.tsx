import { BotttomSheet, useBottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Input } from '@/components/Input';
import { Loading } from '@/components/Loading';
import { TransactionTypeSwitch } from '@/components/TransactionTypeSwitch';
import { Typography } from '@/components/Typography';
import { createTransaction } from '@/database/transactions/createTransaction';
import { useDatabase } from '@/hooks/useDatabase';
import { useScreenState } from '@/hooks/useScreenState';
import { theme } from '@/styles/theme';
import { formatCurrency, formatDate, parseCurrencyToCents } from '@/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { ArrowLeft, DollarSign } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AdvancedCheckbox } from 'react-native-advanced-checkbox';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

export default function CreateTransaction() {
  const [transactionName, setTransactionName] = useState('');
  const [transactionType, setTransactionType] = useState<number>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [haveInstallment, setHaveInstallment] = useState<boolean | string>(false);
  const [installment, setInstallment] = useState<string | null>();
  const [installmentQtd, setInstallmentQtd] = useState<string | null>();
  const [haveChanges, setHaveChanges] = useState(false);

  const {
    handleChangeScreenStateToError,
    handleChangeScreenStateToLoading,
    handleChangeScreenStateToSuccess,
    handleChangeScreenStateToDefault,
    isScreenStateDefault,
    isScreenStateError,
    isScreenStateLoading,
    isScreenStateSuccess,
  } = useScreenState();
  const { database } = useDatabase();

  const currencyValueRef = useRef<TextInput>(null);
  const categoryValueRef = useRef<TextInput>(null);

  const { isOpen, toggleSheet } = useBottomSheet();

  const isCreateButtonDisabled = !transactionType && !transactionName;

  const handleCreateTransaction = () => {
    handleChangeScreenStateToLoading();

    createTransaction(database, {
      name: transactionName,
      amount,
      installment: typeof installment !== 'undefined' ? Number(installment) : null,
      installment_qtd: typeof installment !== 'undefined' ? Number(installmentQtd) : null,
      type: transactionType!,
      date: selectedDate.toISOString(),
      category,
    })
      .then(() => {
        handleChangeScreenStateToSuccess();
        setHaveChanges(true);
      })
      .catch((error) => {
        console.log(error);
        handleChangeScreenStateToError();
      });
  };

  const handleBack = () => {
    router.back();
    router.setParams({ update: haveChanges } as any);
  };

  return (
    <>
      <Container>
        {isScreenStateDefault && (
          <View style={styles.flex}>
            <View style={styles.modalHeader}>
              <Button
                variant="ghost"
                Icon={ArrowLeft}
                onPress={handleBack}
                style={{ zIndex: 1, minWidth: 'auto', minHeight: 'auto' }}
              />
              <Typography style={styles.title}>Nova Transação</Typography>
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
                onEndEditing={() => {
                  categoryValueRef?.current?.focus?.();
                }}
                ref={currencyValueRef}
              />
              <Input
                label="Categoria"
                value={category}
                onChangeText={setCategory}
                ref={categoryValueRef}
              />

              <TransactionTypeSwitch onSelect={setTransactionType} />
              <View style={styles.dateContent}>
                <Typography variant="label">Data</Typography>
                <TouchableOpacity style={styles.dateContainer} onPress={toggleSheet}>
                  <Typography>{formatDate(selectedDate.toString())}</Typography>
                </TouchableOpacity>
              </View>
              <AdvancedCheckbox
                label="Transação parcelada?"
                value={haveInstallment}
                onValueChange={setHaveInstallment}
                checkedColor={theme.colors.primary}
                labelStyle={styles.checkboxLabel}
              />
              {haveInstallment && (
                <Animated.View
                  style={styles.installmentContainer}
                  entering={FadeIn.duration(300).easing(Easing.inOut(Easing.quad))}
                  exiting={FadeOut.duration(300).easing(Easing.inOut(Easing.quad))}>
                  <Input
                    label="Parcela atual"
                    value={installment || ''}
                    onChangeText={setInstallment}
                    containerStyle={styles.installmentInput}
                    keyboardType="number-pad"
                    returnKeyType="next"
                  />
                  <Input
                    label="Total parcelas"
                    value={installmentQtd || ''}
                    onChangeText={setInstallmentQtd}
                    keyboardType="number-pad"
                    containerStyle={styles.installmentInput}
                    returnKeyType="next"
                  />
                </Animated.View>
              )}
            </View>
            <Button
              variant="primary"
              title="Criar"
              disabled={isCreateButtonDisabled}
              onPress={handleCreateTransaction}
            />
          </View>
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
              source={{
                uri: 'error-animation',
              }}
              loop={false}
            />
            <Typography variant="section" style={styles.errorStateText}>
              Ocorreu um erro inesperado, por favor, tente novamente.
            </Typography>
            <Button title="Fechar" onPress={handleBack} />
          </View>
        )}

        {isScreenStateSuccess && (
          <View style={styles.statesContainer}>
            <LottieView
              autoPlay
              style={theme.sizes.errorTransation}
              source={{ uri: 'success-animation' }}
            />

            <Typography variant="section" style={styles.errorStateText}>
              Transação criada com sucesso!
            </Typography>
            <View style={styles.buttonContainer}>
              <Button
                title="Criar uma nova"
                onPress={handleChangeScreenStateToDefault}
                style={styles.buttonStyle}
              />
              <Button
                title="Fechar"
                variant="secondary"
                onPress={handleBack}
                style={styles.buttonStyle}
              />
            </View>
          </View>
        )}
      </Container>

      <BotttomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        <View style={styles.dateModalContainer}>
          <DateTimePicker
            display="spinner"
            mode="date"
            value={selectedDate}
            onChange={(_, date) => {
              setSelectedDate(date!);
            }}
          />
          <Button title="Salvar" onPress={toggleSheet} />
        </View>
      </BotttomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  dateModalContainer: {
    padding: theme.spacing.md,
  },
  dateContent: {
    gap: theme.spacing.xs,
  },
  dateContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  checkboxLabel: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.family.regular,
  },
  installmentContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  installmentInput: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    position: 'relative',
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  avoidView: {},
  content: {
    flex: 1,
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.md,
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

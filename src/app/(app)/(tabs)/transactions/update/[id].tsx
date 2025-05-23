import { BotttomSheet, useBottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Input } from '@/components/Input';
import { Loading } from '@/components/Loading';
import { TransactionTypeSwitch } from '@/components/TransactionTypeSwitch';
import { Typography } from '@/components/Typography';
import { getTransactionById } from '@/database/transactions/getTransactionById';
import { updateTransaction } from '@/database/transactions/updateTransaction';
import { useDatabase } from '@/hooks/useDatabase';
import { useScreenState } from '@/hooks/useScreenState';
import { theme } from '@/styles/theme';
import { formatCurrency, formatDate, parseCurrencyToCents } from '@/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { ArrowLeft, DollarSign } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AdvancedCheckbox } from 'react-native-advanced-checkbox';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

const AnimatedTypography = Animated.createAnimatedComponent(Typography);

export default function UpdateTransaction() {
  const [transactionName, setTransactionName] = useState('');
  const [transactionType, setTransactionType] = useState<number>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [haveInstallment, setHaveInstallment] = useState<boolean | string>(false);
  const [installment, setInstallment] = useState<string | null>();
  const [installmentQtd, setInstallmentQtd] = useState<string | null>();

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

  const currencyValueRef = useRef<TextInput>(null);
  const categoryValueRef = useRef<TextInput>(null);
  const { isOpen, toggleSheet } = useBottomSheet();

  const isUpdateButtonDisabled = !transactionType && !transactionName;

  const handleUpdateTransaction = () => {
    handleChangeScreenStateToLoading();

    updateTransaction(database, {
      name: transactionName,
      amount,
      id,
      type: transactionType!,
      date: selectedDate.toISOString(),
      category,
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
      if (data?.category) setCategory(data?.category);

      if (data?.installment && data?.installment_qtd) {
        setInstallment(data?.installment.toString());
        setInstallmentQtd(data?.installment_qtd.toString());
        setHaveInstallment(true);
      }
    } catch (error) {
      console.log('error');
    }
  };

  const handleBack = (haveChanges?: boolean) => {
    router.back();
    router.setParams({
      update: !!haveChanges,
    } as any);
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, []),
  );

  return (
    <>
      <Container>
        {isScreenStateDefault && (
          <View style={styles.flex}>
            <View style={styles.modalHeader}>
              <Button
                variant="ghost"
                Icon={ArrowLeft}
                onPress={() => handleBack(false)}
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
                returnKeyType="next"
              />
              <Input
                label="Categoria"
                value={category}
                onChangeText={setCategory}
                ref={categoryValueRef}
                returnKeyType="next"
              />
              <TransactionTypeSwitch onSelect={setTransactionType} initialValue={transactionType} />
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
                disabled
              />
              {haveInstallment && (
                <Animated.View
                  style={styles.installmentContainer}
                  entering={FadeIn.duration(300).easing(Easing.inOut(Easing.quad))}
                  exiting={FadeOut.duration(300).easing(Easing.inOut(Easing.quad))}>
                  <Input
                    label="Parcela atual"
                    editable={false}
                    value={installment || ''}
                    onChangeText={setInstallment}
                    containerStyle={styles.installmentInput}
                    keyboardType="number-pad"
                    returnKeyType="next"
                  />
                  <Input
                    label="Total parcelas"
                    editable={false}
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
              title="Atualizar"
              disabled={isUpdateButtonDisabled}
              onPress={handleUpdateTransaction}
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
            <Button title="Fechar" onPress={() => handleBack(false)} />
          </View>
        )}

        {isScreenStateSuccess && (
          <View style={styles.statesContainer}>
            <LottieView
              autoPlay
              style={theme.sizes.errorTransation}
              source={{ uri: 'success-animation' }}
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
                onPress={() => handleBack(true)}
                style={styles.buttonStyle}
              />
            </Animated.View>
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
  installmentContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  installmentInput: {
    flex: 1,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  checkboxLabel: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.family.regular,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  avoidView: {
    flex: 1,
  },
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

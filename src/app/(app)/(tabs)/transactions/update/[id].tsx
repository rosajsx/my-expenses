import { BottomSheet, useBottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { PageHeader } from '@/components/Header/index';
import { Input } from '@/components/Input/index';
import { InputColumn } from '@/components/Input/InputColumn';
import { InputSwitch } from '@/components/Input/InputSwitch';
import { Separator } from '@/components/Separator';
import { Typography } from '@/components/Typography';
import { getTransactionById } from '@/database/transactions/getTransactionById';
import { updateTransaction } from '@/database/transactions/updateTransaction';
import { useDatabase } from '@/hooks/useDatabase';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { useScreenState } from '@/hooks/useScreenState';
import { colors } from '@/styles/colors';
import { theme } from '@/styles/theme';
import { formatCurrency, formatDate, parseCurrencyToCents } from '@/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, StyleSheet, Switch, TextInput, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

const quantitiesOfInstallments = new Array(48).fill(null).map((item, index) => {
  return index + 1;
});

const incomeTypeOptions = [
  {
    label: 'Entrada',
    value: 1,
  },
  {
    label: 'Saída',
    value: 2,
  },
];

export default function UpdateTransaction() {
  const [transactionName, setTransactionName] = useState('');
  const [transactionType, setTransactionType] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [haveInstallment, setHaveInstallment] = useState<boolean>(false);
  const [installmentQtd, setInstallmentQtd] = useState<string | null>();

  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    handleChangeScreenStateToLoading,
    handleChangeScreenStateToSuccess,
    handleChangeScreenStateToDefault,
    isScreenStateLoading,
    isScreenStateSuccess,
  } = useScreenState();
  const { database } = useDatabase();

  const currencyValueRef = useRef<TextInput>(null);
  const categoryValueRef = useRef<TextInput>(null);
  const { isOpen, toggleSheet } = useBottomSheet();
  const { isOpen: isInstallmentQtdOpen, toggleSheet: toggleSheetInstallmentQtd } = useBottomSheet();

  const isUpdateButtonDisabled = !transactionName || amount === 0;

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
        Alert.alert('Ocorreu um erro inesperado ao atualizar a transação!', error?.message || '', [
          {
            text: 'OK',
          },
        ]);
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
        setInstallmentQtd(data?.installment_qtd.toString());
        setHaveInstallment(true);
      }
    } catch (error) {
      console.log('error');
    }
  };

  const handleBack = (haveChanges?: boolean) => {
    router.navigate('/transactions');
    router.setParams({
      update: !!haveChanges,
    } as any);
  };

  useHideTabBar();

  useFocusEffect(
    useCallback(() => {
      getData();
    }, []),
  );

  return (
    <>
      <Container style={styles.wrapper}>
        <PageHeader
          title="Atualizar Transação"
          actionText="Salvar"
          cancelText="Cancelar"
          isActionButtonDisabled={isUpdateButtonDisabled || isScreenStateLoading}
          isActionButtonLoading={isScreenStateLoading}
          isCancelButtonDisabled={isScreenStateLoading}
          onAction={handleUpdateTransaction}
        />
        <View style={styles.main}>
          <Card>
            <InputColumn
              label="Nome da Transação"
              placeholder="Digite o nome"
              placeholderTextColor={colors.textSecondary}
              returnKeyType="next"
              value={transactionName}
              onChangeText={setTransactionName}
              onSubmitEditing={() => {
                currencyValueRef?.current?.focus?.();
              }}
            />
          </Card>

          <Card>
            <Input
              label="Valor"
              placeholder="R$ 00,00"
              keyboardType="number-pad"
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
          </Card>

          <Card>
            <InputSwitch
              value={transactionType}
              options={incomeTypeOptions}
              onChange={(value) => setTransactionType(value as number)}
            />
          </Card>

          <Card>
            <Input
              label="Data"
              valueWithAction
              value={formatDate(selectedDate.toString(), {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
              onAction={toggleSheet}
            />
            <Separator />
            <Input
              label="Categoria"
              placeholder="Digite a categoria"
              returnKeyType="next"
              value={category}
              onChangeText={setCategory}
            />
          </Card>

          <Card>
            <Input
              label="Parcelado"
              RightComponent={<Switch value={haveInstallment} onValueChange={setHaveInstallment} />}
            />

            <Separator />
            <Input
              label="Qtde de parcelas"
              valueWithAction
              onAction={toggleSheetInstallmentQtd}
              value={installmentQtd || '1'}
              disabled={!haveInstallment}
            />
          </Card>
        </View>
      </Container>

      <BottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        <View style={styles.dateModalContainer}>
          <DateTimePicker
            display="spinner"
            mode="date"
            value={selectedDate}
            textColor={colors.text}
            onChange={(_, date) => {
              setSelectedDate(date!);
            }}
          />
        </View>
      </BottomSheet>
      <BottomSheet isOpen={isInstallmentQtdOpen} toggleSheet={toggleSheetInstallmentQtd}>
        <View style={styles.dateModalContainer}>
          <Picker selectedValue={installmentQtd} onValueChange={setInstallmentQtd}>
            {quantitiesOfInstallments.map((item) => (
              <Picker.Item key={item} label={item.toString()} value={item} />
            ))}
          </Picker>
        </View>
      </BottomSheet>

      <BottomSheet
        isOpen={{ value: isScreenStateSuccess } as SharedValue<boolean>}
        toggleSheet={handleChangeScreenStateToDefault}>
        <View style={styles.sucessModalContainer}>
          <Typography align="center" variant="heading/md" style={{ marginBottom: 24 }}>
            Transação atualizada com sucesso!
          </Typography>

          <Button title="Fechar" onPress={router.back} />
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 24,
  },

  main: {
    gap: 24,
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

  sucessModalContainer: {},
});

import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { PageHeader } from '@/components/Header/index';
import { Input } from '@/components/Input/index';
import { InputColumn } from '@/components/Input/InputColumn';
import { InputSwitch } from '@/components/Input/InputSwitch';
import { Separator } from '@/components/Separator';
import { SelectDateModal } from '@/components/Sheets/SelectDateModal';
import { SelectInstallmentsModal } from '@/components/Sheets/SelectInstallmentsModal';
import { UpdateTransactionSuccessModal } from '@/components/Sheets/UpdateTransactionSuccessModal';
import { getTransactionById } from '@/database/transactions/getTransactionById';
import { updateTransaction } from '@/database/transactions/updateTransaction';
import { useDatabase } from '@/hooks/useDatabase';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { useScreenState } from '@/hooks/useScreenState';
import { colors } from '@/styles/colors';
import { formatCurrency, formatDate, parseCurrencyToCents } from '@/utils';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, StyleSheet, Switch, TextInput, View } from 'react-native';

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
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isInstallmentsModalOpen, setIsInstallmentsModalOpen] = useState(false);

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
              onAction={() => setIsDateModalOpen(true)}
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
              onAction={() => setIsInstallmentsModalOpen(true)}
              value={installmentQtd || '1'}
              disabled={!haveInstallment}
            />
          </Card>
        </View>
      </Container>
      <SelectDateModal
        isOpen={isDateModalOpen}
        toggleSheet={() => setIsDateModalOpen(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <SelectInstallmentsModal
        isOpen={isInstallmentsModalOpen}
        toggleSheet={() => setIsInstallmentsModalOpen(false)}
        installmentQtd={installmentQtd}
        setInstallmentQtd={setInstallmentQtd}
      />

      <UpdateTransactionSuccessModal
        isOpen={isScreenStateSuccess}
        toggleSheet={handleChangeScreenStateToDefault}
      />
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

  sucessModalContainer: {},
});

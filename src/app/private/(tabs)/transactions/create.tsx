import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { PageHeader } from '@/components/Header/index';
import { Input } from '@/components/Input/index';
import { InputColumn } from '@/components/Input/InputColumn';
import { InputSwitch } from '@/components/Input/InputSwitch';
import { Separator } from '@/components/Separator';
import { CreateTransactionSuccessModal } from '@/components/Sheets/CreateTransactionSuccessModal';
import { SelectDateModal } from '@/components/Sheets/SelectDateModal';
import { SelectInstallmentsModal } from '@/components/Sheets/SelectInstallmentsModal';
import { createTransaction } from '@/database/transactions/createTransaction';
import { useDatabase } from '@/hooks/useDatabase';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { useScreenState } from '@/hooks/useScreenState';
import { colors } from '@/styles/colors';
import { formatCurrency, formatDate, parseCurrencyToCents } from '@/utils';
import { useRef, useState } from 'react';
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

export default function CreateTransaction() {
  const [transactionName, setTransactionName] = useState('');
  const [transactionType, setTransactionType] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [haveInstallment, setHaveInstallment] = useState<boolean>(false);
  const [installmentQtd, setInstallmentQtd] = useState<string | null>();

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isInstallmentsModalOpen, setIsInstallmentsModalOpen] = useState(false);

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

  const isCreateButtonDisabled = !transactionName || amount === 0;

  useHideTabBar();

  const handleReset = () => {
    handleChangeScreenStateToDefault();
    setTransactionName('');
    setTransactionType(1);
    setSelectedDate(new Date());
    setAmount(0);
    setCategory('');
    setHaveInstallment(false);
    setInstallmentQtd(null);
  };

  const handleCreateTransaction = () => {
    handleChangeScreenStateToLoading();

    createTransaction(database, {
      name: transactionName,
      amount,
      installment: haveInstallment ? 1 : null,
      installment_qtd: haveInstallment && installmentQtd ? Number(installmentQtd) : null,
      type: transactionType!,
      date: selectedDate.toISOString(),
      category,
    })
      .then(() => {
        handleChangeScreenStateToSuccess();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Ocorreu um erro inesperado ao criar a transação!', error?.message || '', [
          {
            text: 'OK',
          },
        ]);
      });
  };

  return (
    <>
      <Container style={styles.wrapper}>
        <PageHeader
          title="Nova Transação"
          actionText="Salvar"
          cancelText="Cancelar"
          isActionButtonDisabled={isCreateButtonDisabled || isScreenStateLoading}
          isActionButtonLoading={isScreenStateLoading}
          isCancelButtonDisabled={isScreenStateLoading}
          onAction={handleCreateTransaction}
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

      <CreateTransactionSuccessModal
        isOpen={isScreenStateSuccess}
        toggleSheet={handleChangeScreenStateToDefault}
        onReset={handleReset}
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
});

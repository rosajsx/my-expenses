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
import { useUpdateTransaction } from '@/hooks/features/useUpdateTransaction';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { colors } from '@/styles/colors';
import { formatCurrency, formatDate, parseCurrencyToCents } from '@/utils';
import { useRef } from 'react';
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
  const {
    response: { isLoading },
    transactionName,
    transactionType,
    selectedDate,
    amount,
    category,
    haveInstallment,
    installmentQtd,
    isDateModalOpen,
    isInstallmentsModalOpen,
    setTransactionName,
    setTransactionType,
    setSelectedDate,
    setAmount,
    setCategory,
    setHaveInstallment,
    setInstallmentQtd,
    setIsDateModalOpen,
    setIsInstallmentsModalOpen,
    updateTransactionMutation,
  } = useUpdateTransaction();

  const currencyValueRef = useRef<TextInput>(null);
  const categoryValueRef = useRef<TextInput>(null);

  const isUpdateButtonDisabled = !transactionName || amount === 0;

  const handleUpdate = async () => {
    try {
      await updateTransactionMutation.mutateAsync();
    } catch (error) {
      console.log('Error updating transaction:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a transação. Tente novamente mais tarde.');
    }
  };

  useHideTabBar();

  return (
    <>
      <Container style={styles.wrapper}>
        <PageHeader
          title="Atualizar Transação"
          actionText="Salvar"
          cancelText="Cancelar"
          isActionButtonDisabled={isUpdateButtonDisabled || isLoading}
          isActionButtonLoading={isLoading}
          isCancelButtonDisabled={isLoading}
          onAction={handleUpdate}
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
        isOpen={updateTransactionMutation.isSuccess}
        toggleSheet={() => updateTransactionMutation.reset()}
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

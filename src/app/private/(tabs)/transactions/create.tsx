import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { PageHeader } from '@/components/Header/index';
import { Input } from '@/components/Input/index';
import { InputColumn } from '@/components/Input/InputColumn';
import { InputSwitch } from '@/components/Input/InputSwitch';
import { Separator } from '@/components/Separator';
import { CreateTransactionSuccessModal } from '@/components/Sheets/CreateTransactionSuccessModal';
import { SelectCategoriesModal } from '@/components/Sheets/SelectCategoriesModal';
import { SelectDateModal } from '@/components/Sheets/SelectDateModal';
import { SelectInstallmentsModal } from '@/components/Sheets/SelectInstallmentsModal';
import { useCreateTransaction } from '@/hooks/features/useCreateTransaction';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { colors } from '@/styles/colors';
import { formatCurrency, formatDate, parseCurrencyToCents } from '@/utils';
import { StyleSheet, Switch, View } from 'react-native';

export default function CreateTransaction() {
  const {
    transactionName,
    transactionType,
    selectedDate,
    amount,
    category,
    haveInstallment,
    installmentQtd,
    setAmount,
    isDateModalOpen,
    isInstallmentsModalOpen,
    setTransactionName,
    setTransactionType,
    setSelectedDate,
    setCategory,
    setHaveInstallment,
    setInstallmentQtd,
    currencyValueRef,
    categoryValueRef,
    resetStore: resetCreateTransactionStore,
    incomeTypeOptions,
    isCreateButtonDisabled,
    createTransactionMutation,
    setIsDateModalOpen,
    setIsInstallmentsModalOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    categories,
    isFixedExpense,
    setIsFixedExpense,
  } = useCreateTransaction();

  useHideTabBar();

  return (
    <>
      <Container style={styles.wrapper}>
        <PageHeader
          title="Nova Transação"
          actionText="Salvar"
          cancelText="Cancelar"
          isActionButtonDisabled={isCreateButtonDisabled || createTransactionMutation.isPending}
          isActionButtonLoading={createTransactionMutation.isPending}
          isCancelButtonDisabled={createTransactionMutation.isPending}
          onAction={() => createTransactionMutation.mutate()}
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
              valueWithAction
              value={category?.name || ''}
              onAction={() => setIsCategoryModalOpen(true)}
            />
            <Separator />
            <Input
              label="Fixo ou Recorrente?"
              RightComponent={<Switch value={isFixedExpense} onValueChange={setIsFixedExpense} />}
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
        isOpen={createTransactionMutation.isSuccess}
        toggleSheet={createTransactionMutation.reset}
        onReset={resetCreateTransactionStore}
      />

      <SelectCategoriesModal
        value={category}
        isOpen={isCategoryModalOpen}
        toggleSheet={() => setIsCategoryModalOpen(false)}
        categories={categories.data || []}
        setSelectedCategory={setCategory}
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

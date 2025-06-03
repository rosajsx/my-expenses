import { BotttomSheet, useBottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Separator } from '@/components/Separator';
import { Typography } from '@/components/Typography';
import { createTransaction } from '@/database/transactions/createTransaction';
import { useDatabase } from '@/hooks/useDatabase';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { useScreenState } from '@/hooks/useScreenState';
import { colors } from '@/styles/colors';
import { theme } from '@/styles/theme';
import { formatCurrency, formatDate, parseCurrencyToCents } from '@/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SharedValue } from 'react-native-reanimated';

const quantitiesOfInstallments = new Array(48).fill(null).map((item, index) => {
  return index + 1;
});

export default function CreateTransaction() {
  const [transactionName, setTransactionName] = useState('');
  const [transactionType, setTransactionType] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [haveInstallment, setHaveInstallment] = useState<boolean>(false);
  const [installmentQtd, setInstallmentQtd] = useState<string | null>();

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
        <View style={styles.header}>
          <Button
            variant="ghost"
            onPress={router.back}
            disabled={isScreenStateLoading}
            title="Cancelar"
          />

          <Typography variant="body/lg">Nova Transação</Typography>
          <Button
            variant="ghost"
            disabled={isCreateButtonDisabled || isScreenStateLoading}
            onPress={handleCreateTransaction}
            title={isScreenStateLoading ? undefined : 'Salvar'}>
            {isScreenStateLoading && <ActivityIndicator color={colors.primary} />}
          </Button>
        </View>
        <View style={styles.main}>
          <View style={styles.container}>
            <Typography variant="body/md" color="text">
              Nome da Transação{' '}
            </Typography>
            <Separator />
            <TextInput
              style={styles.textInput}
              placeholder="Digite o nome"
              placeholderTextColor={colors.textSecondary}
              returnKeyType="next"
              value={transactionName}
              onChangeText={setTransactionName}
              onSubmitEditing={() => {
                currencyValueRef?.current?.focus?.();
              }}
            />
          </View>

          <View style={styles.container}>
            <View style={styles.input}>
              <Typography variant="body/md" color="text">
                Valor
              </Typography>
              <TextInput
                style={styles.textInput}
                placeholder="R$ 00,00"
                keyboardType="number-pad"
                placeholderTextColor={colors.textSecondary}
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
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.inputTypeContainer}>
              <Pressable
                style={[
                  styles.inputTypeItem,
                  transactionType === 1 && styles.inputTypeItemSelected,
                ]}
                onPress={() => setTransactionType(1)}>
                <Typography variant="body/md-500" color={transactionType === 1 ? 'white' : 'text'}>
                  Entrada
                </Typography>
              </Pressable>
              <Pressable
                style={[
                  styles.inputTypeItem,
                  transactionType === 2 && styles.inputTypeItemSelected,
                ]}
                onPress={() => setTransactionType(2)}>
                <Typography variant="body/md-500" color={transactionType === 2 ? 'white' : 'text'}>
                  Saída
                </Typography>
              </Pressable>
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.input}>
              <Typography variant="body/md" color="text">
                Data
              </Typography>
              <Pressable style={styles.inputWithOptions} onPress={toggleSheet}>
                <Text style={[styles.inputTypeText, styles.inputTypeTextWithItems]}>
                  {formatDate(selectedDate.toString(), {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Text>
                <ChevronRight color={colors.textSecondary} />
              </Pressable>
            </View>
            <Separator />
            <View style={styles.input}>
              <Typography variant="body/md" color="text">
                Categoria
              </Typography>
              <TextInput
                style={styles.textInput}
                placeholder="Digite a categoria"
                placeholderTextColor={colors.textSecondary}
                returnKeyType="next"
                value={category}
                onChangeText={setCategory}
              />
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.input}>
              <Typography variant="body/md" color="text">
                Parcelado
              </Typography>
              <Switch value={haveInstallment} onValueChange={setHaveInstallment} />
            </View>
            <Separator />
            <View style={[styles.input, !haveInstallment && styles.disabledField]}>
              <Typography variant="body/md" color="text">
                Qtde de parcelas
              </Typography>
              <Pressable style={[styles.inputWithOptions]} onPress={toggleSheetInstallmentQtd}>
                <Text style={[styles.inputTypeText, styles.inputTypeTextWithItems]}>
                  {installmentQtd || 1}
                </Text>
                <ChevronRight color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
        </View>
      </Container>

      <BotttomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
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
      </BotttomSheet>
      <BotttomSheet isOpen={isInstallmentQtdOpen} toggleSheet={toggleSheetInstallmentQtd}>
        <View style={styles.dateModalContainer}>
          <Picker selectedValue={installmentQtd} onValueChange={setInstallmentQtd}>
            {quantitiesOfInstallments.map((item) => (
              <Picker.Item key={item} label={item.toString()} value={item} />
            ))}
          </Picker>
        </View>
      </BotttomSheet>

      <BotttomSheet
        isOpen={{ value: isScreenStateSuccess } as SharedValue<boolean>}
        toggleSheet={handleChangeScreenStateToDefault}>
        <View style={styles.sucessModalContainer}>
          <Typography align="center" variant="heading/md" style={{ marginBottom: 8 }}>
            Transação salva com sucesso!
          </Typography>
          <Typography align="center" variant="body/md" style={{ marginBottom: 24 }}>
            O que deseja fazer agora?
          </Typography>

          <Button
            variant="primary"
            title="Criar nova transação"
            onPress={handleReset}
            style={{ marginBottom: 8 }}
          />
          <Button variant="ghost" title="Fechar" onPress={router.back} />
        </View>
      </BotttomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 24,
  },
  header: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',
  },

  main: {
    gap: 24,
  },
  headerButton: {},
  disabledField: {
    pointerEvents: 'none',
    opacity: 0.5,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    minHeight: 44,
  },

  textInput: {
    fontSize: 17,
    fontFamily: 'Inter_400Regular',
    fontWeight: 400,
    textAlign: 'left',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
  },
  inputColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },

  inputWithOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputTypeContainer: {
    flexDirection: 'row',
  },
  inputTypeItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  inputTypeText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    fontWeight: 500,
    color: colors.text,
  },
  inputTypeTextWithItems: {
    color: colors.textSecondary,
  },
  inputTypeItemSelected: {
    backgroundColor: colors.primary,
  },
  inputTypeTextSelected: {
    color: colors.white,
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

import { Button } from '@/src/components/Button';
import { Container } from '@/src/components/Container';
import { Input } from '@/src/components/Input';
import { theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { KeyboardAvoidingView, StyleSheet, TextInput, View } from 'react-native';

export default function CreateTransaction() {
  return (
    <Container>
      <KeyboardAvoidingView style={styles.avoidView}>
        <View style={styles.modalHeader}>
          <Button variant="ghost" Icon={X} onPress={router.back} />
        </View>
        <View style={styles.content}>
          <Input label="Nome" />
          <Input error label="Nome" errorText="Deu erro tio" />
          <Input editable={false} />

          {/* Data = DatePicker */}
          {/* Tipo = Switch */}
        </View>
        <View style={styles.footer}></View>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    alignItems: 'flex-end',
  },
  avoidView: {
    flex: 1,
  },
  content: {
    borderWidth: 1,
    flex: 1,
    gap: theme.spacing.lg,
  },
  footer: {
    borderWidth: 1,
    borderColor: 'red',
  },
  input: {},
});

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Input } from '@/components/Input';
import { Typography } from '@/components/Typography';
import { useBoundStore } from '@/store';
import { theme } from '@/styles/theme';
import { router } from 'expo-router';
import { Copy, Link, X } from 'lucide-react-native';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export default function User() {
  const hash = useBoundStore((state) => state.authHash);
  const logout = useBoundStore((state) => state.logout);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(hash || '');
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.back();
      router.replace('/sign-in');
    } catch (error) {
      console.log('handleLogout', error);
      Alert.alert('Ocorreu um erro inesperado ao tentar deslogar!');
    }
  };

  return (
    <Container>
      <View style={styles.header}>
        <Pressable onPress={router.back}>
          <X color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Typography>ID de usuário</Typography>
        <Input
          value={hash || ''}
          editable={false}
          placeholder="ID usuário"
          LeftIcon={Link}
          returnKeyType="done"
        />
        <Button
          variant="ghost"
          Icon={Copy}
          title="Copiar ID"
          iconColor="primary"
          style={styles.copyButton}
          onPress={copyToClipboard}
        />
      </View>
      <View style={styles.footer}>
        <Button variant="secondary" title="Sair" color="textPrimary" onPress={handleLogout} />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  footer: {},
});

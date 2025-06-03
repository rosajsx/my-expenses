import { theme } from '@/styles/theme';
import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

export default function User() {
  //const hash = useBoundStore((state) => state.authHash);
  //const logout = useBoundStore((state) => state.logout);

  const copyToClipboard = async () => {
    //  await Clipboard.setStringAsync(hash || '');
  };

  const handleLogout = async () => {
    try {
      //   await logout();
      router.back();
      router.replace('/sign-in');
    } catch (error) {
      console.log('handleLogout', error);
      Alert.alert('Ocorreu um erro inesperado ao tentar deslogar!');
    }
  };

  //const { isOpen, toggleSheet } = useBottomSheet(false);

  const handleClose = () => {
    //toggleSheet();

    setTimeout(() => router.back(), 500);
  };

  // useEffect(() => {
  //   toggleSheet();
  // }, []);

  return (
    <View />
    // <BottomSheet isOpen={isOpen} containerHeight={300} onClose={handleClose}>
    //   <View style={styles.container}>
    //     <View style={styles.content}>
    //       <Typography>ID de usuário</Typography>
    //       <Input
    //         value={hash || ''}
    //         editable={false}
    //         placeholder="ID usuário"
    //         LeftIcon={Link}
    //         returnKeyType="done"
    //       />
    //       <Button
    //         variant="ghost"
    //         Icon={Copy}
    //         title="Copiar ID"
    //         iconColor="primary"
    //         style={styles.copyButton}
    //         onPress={copyToClipboard}
    //       />
    //     </View>
    //     <View>
    //       <Button variant="secondary" title="Sair" color="textPrimary" onPress={handleLogout} />
    //     </View>
    //   </View>
    // </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  content: {
    flex: 1,
    gap: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
});

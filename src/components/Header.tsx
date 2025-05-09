import { theme } from '@/styles/theme';
import { router } from 'expo-router';
import { User } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

export const Header = () => {
  const handleGoToUserInfo = () => router.navigate('/user');

  return (
    <View style={styles.container}>
      <Pressable style={styles.pressable} onPress={handleGoToUserInfo}>
        <User color={theme.colors.textPrimary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  pressable: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.full,
    padding: theme.spacing.sm,
  },
});

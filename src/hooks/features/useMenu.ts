import { useMenuStore } from '@/store/menu/menu.store';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';

export const useMenu = () => {
  const { signOut } = useAuth();
  const { isLoading, setIsLoading } = useMenuStore();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
      Alert.alert('Erro ao tentar sair');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignOut, isLoading };
};

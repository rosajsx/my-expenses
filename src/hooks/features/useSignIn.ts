import { useSignInStore } from '@/store/auth/signin.store';
import { useAuth } from './useAuth';

export const useSignIn = () => {
  const {
    isLoading: isSignInLoading,
    email,
    password,
    error,
    setEmail,
    setPassword,
    setError,
    setIsLoading,
  } = useSignInStore();
  const { signIn, session, isLoading: isAuthLoading } = useAuth();

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signIn({ email, password });
    } catch (error) {
      setError('Credenciais inválidas. Tente novamente.');
      console.log('Error during sign in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoading = isSignInLoading || isAuthLoading;

  return {
    isLoading,
    email,
    password,
    error,
    setEmail,
    setPassword,
    handleSubmit,
    session,
  };
};

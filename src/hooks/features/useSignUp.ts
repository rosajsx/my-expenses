import { useSignUpStore } from '@/store/auth/signup.store';
import { router } from 'expo-router';
import { useAuth } from './useAuth';

export const useSignUp = () => {
  const {
    isLoading,
    email,
    password,
    error,
    confirmPassword,
    setConfirmPassword,
    setEmail,
    setPassword,
    setError,
    setIsLoading,
    isConfirmPasswordVisible,
    isPasswordVisible,
    setIsConfirmPasswordVisible,
    setIsPasswordVisible,
  } = useSignUpStore();
  const { signUp, session } = useAuth();

  const isPasswordsEquals = () => {
    return password === confirmPassword;
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const isValid = isPasswordsEquals();
      if (!isValid) {
        setError('As senhas não coincidem. Por favor, tente novamente.');
        return;
      }

      await signUp({ email, password });
      router.replace('/private/(tabs)/transactions');
    } catch (error) {
      setError(error?.message || 'Erro ao criar conta. Por favor, tente novamente.');
      console.log('Error during sign in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = !email || !password || !confirmPassword || isLoading;

  return {
    isLoading,
    email,
    password,
    confirmPassword,
    error,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    isConfirmPasswordVisible,
    isPasswordVisible,
    setIsConfirmPasswordVisible,
    setIsPasswordVisible,
    isSubmitDisabled,
    session,
  };
};

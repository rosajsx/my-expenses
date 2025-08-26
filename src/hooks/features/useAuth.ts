import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Session } from '@/types/session';

type SignInParams = {
  email: string;
  password: string;
};

type SignUpParams = {
  email: string;
  password: string;
};

const STORAGE_KEY = 'session';

export const useAuth = (enabled = false) => {
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery<Session | null>({
    queryKey: ['session'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Session) : null;
    },
    staleTime: Infinity,
    enabled,
  });

  const signIn = async ({ email }: SignInParams) => {
    const newSession: Session = { user: { id: email } };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    queryClient.setQueryData(['session'], newSession);
  };

  const signUp = async ({ email }: SignUpParams) => {
    await signIn({ email, password: '' });
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    queryClient.setQueryData(['session'], null);
  };

  useEffect(() => {
    // nothing to subscribe to in local auth
  }, []);

  return {
    signIn,
    signOut,
    session,
    isLoading,
    signUp,
  };
};

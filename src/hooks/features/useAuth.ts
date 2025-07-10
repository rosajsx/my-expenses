import { supabase } from '@/services/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';

type SignInParams = {
  email: string;
  password: string;
};

export const useAuth = (enabled = false) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }
      return data.session;
    },
    staleTime: Infinity,
    enabled,
  });

  const signIn = async ({ email, password }: SignInParams) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    return;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return;
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      queryClient.setQueryData(['session'], currentSession);

      if (!currentSession) {
        if (pathname !== '/sign-in') {
          router.replace('/sign-in');
        }
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  return {
    signIn,
    signOut,
    session,
    isLoading,
  };
};

import { supabase } from '@/services/supabase';
import { useAuthStore } from './auth.store';

export const useAuth = () => {
  const { session, setSession } = useAuthStore();

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    setSession(data.session);
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    setSession(null);
  };

  return {
    session,
    signIn,
    signOut,
    setSession,
  };
};

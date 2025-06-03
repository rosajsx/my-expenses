import { Session } from '@supabase/supabase-js';
import { StateCreator } from 'zustand';
import { supabase } from '../../utils/supabase';

export interface AuthSlice {
  session: Session | null;

  setSession: (session: Session | null) => void;

  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  session: null,

  setSession: (session) => {
    set((state) => ({
      ...state,
      session,
    }));
  },

  signIn: async (email, password) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    set((state) => ({
      ...state,
      session: data.session,
    }));
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    set((state) => ({
      ...state,
      session: null,
    }));
  },
});

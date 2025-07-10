import { create } from 'zustand';
import { SignInStore } from './auth.types';

export const useSignInStore = create<SignInStore>((set) => ({
  email: '',
  password: '',
  error: null,
  isLoading: false,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

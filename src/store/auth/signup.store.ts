import { create } from 'zustand';
import { SignUpStore } from './auth.types';

export const useSignUpStore = create<SignUpStore>((set) => ({
  email: '',
  password: '',
  confirmPassword: '',
  error: null,
  isLoading: false,
  isPasswordVisible: false,
  isConfirmPasswordVisible: false,
  setIsPasswordVisible: (isVisible) => set({ isPasswordVisible: isVisible }),
  setIsConfirmPasswordVisible: (isVisible) => set({ isConfirmPasswordVisible: isVisible }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setError: (error) => set({ error }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

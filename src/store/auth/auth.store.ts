import { create } from 'zustand';
import { AuthStore } from './auth.types';

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
}));

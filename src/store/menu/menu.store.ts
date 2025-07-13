import { create } from 'zustand';
import { MenuStore } from './menu.types';

export const useMenuStore = create<MenuStore>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));

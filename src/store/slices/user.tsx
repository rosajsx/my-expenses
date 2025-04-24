import { StateCreator } from 'zustand';

export interface UserSlice {
  userId: string;
  setUserId: (id: string) => void;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
  userId: '',
  setUserId: (id) => set(() => ({ userId: id })),
});

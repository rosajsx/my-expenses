import { StateCreator } from 'zustand';
import Storage from 'expo-sqlite/kv-store';
import * as Crypto from 'expo-crypto';

export interface AuthSlice {
  authHash: string | null;
  setAuthHash: (hash: string) => Promise<void>;

  verifyIfHaveAuthHash: () => Promise<boolean>;
  createAuthHash: () => Promise<void>;
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  authHash: null,
  setAuthHash: async (hash) => {
    await Storage.setItem('my-expenses-user-hash', hash);
    set((state) => ({
      ...state,
      authHash: hash,
    }));
  },

  verifyIfHaveAuthHash: async () => {
    const userHash = await Storage.getItem('my-expenses-user-hash');

    console.log({ userHash });
    if (userHash) {
      set((state) => ({
        ...state,
        authHash: userHash,
      }));
    }

    return !!userHash;
  },
  createAuthHash: async () => {
    const hash = Crypto.randomUUID();
    await Storage.setItem('my-expenses-user-hash', hash);
    console.log('User Hash was Created', hash);
    set((state) => ({ ...state, authHash: hash }));
  },
});

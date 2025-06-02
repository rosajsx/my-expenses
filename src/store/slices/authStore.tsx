import * as Crypto from 'expo-crypto';
import Storage from 'expo-sqlite/kv-store';
import { StateCreator } from 'zustand';

export interface AuthSlice {
  authHash: string | null;
  setAuthHash: (hash: string) => Promise<void>;

  verifyIfHaveAuthHash: () => Promise<boolean>;
  createAuthHash: () => Promise<void>;

  logout: () => Promise<void>;
}

export const hashKey = 'my-expenses-user-hash';

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  authHash: null,
  setAuthHash: async (hash) => {
    await Storage.setItem(hashKey, hash);
    set((state) => ({
      ...state,
      authHash: hash,
    }));
  },

  verifyIfHaveAuthHash: async () => {
    const userHash = await Storage.getItem(hashKey);

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
    await Storage.setItem(hashKey, hash);
    console.log('User Hash was Created', hash);
    set((state) => ({ ...state, authHash: hash }));
  },

  logout: async () => {
    await Storage.removeItem(hashKey);
    set((state) => ({ authHash: null }));
  },
});

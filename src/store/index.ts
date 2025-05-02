import { create } from 'zustand';
import { createTransactionsSlice, TransactionsSlice } from './slices/transactionsSlice';
import { BalanceSlice, createBalanceSlice } from './slices/balanceSlice';
import {
  createTransactionsFilterSlice,
  TransactionFilterSlice,
} from './slices/transactionsFilterSlice';
import { AuthSlice, createAuthSlice } from './slices/authStore';

type BoundStore = TransactionsSlice & BalanceSlice & TransactionFilterSlice & AuthSlice;

export const useBoundStore = create<BoundStore>()((...a) => ({
  ...createTransactionsSlice(...a),
  ...createBalanceSlice(...a),
  ...createTransactionsFilterSlice(...a),
  ...createAuthSlice(...a),
}));

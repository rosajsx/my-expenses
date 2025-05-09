import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from './slices/authStore';
import { BalancePageSlice, createBalancePageSlice } from './slices/balancePageSlice';
import { BalanceSlice, createBalanceSlice } from './slices/balanceSlice';
import {
  createTransactionsFilterSlice,
  TransactionFilterSlice,
} from './slices/transactionsFilterSlice';
import { createTransactionsSlice, TransactionsSlice } from './slices/transactionsSlice';

type BoundStore = TransactionsSlice &
  BalanceSlice &
  TransactionFilterSlice &
  AuthSlice &
  BalancePageSlice;

export const useBoundStore = create<BoundStore>()((...a) => ({
  ...createTransactionsSlice(...a),
  ...createBalanceSlice(...a),
  ...createTransactionsFilterSlice(...a),
  ...createAuthSlice(...a),
  ...createBalancePageSlice(...a),
}));

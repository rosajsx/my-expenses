import { create } from 'zustand';
import { createTransactionsSlice, TransactionsSlice } from './slices/transactionsSlice';
import { BalanceSlice, createBalanceSlice } from './slices/balanceSlice';
import {
  createTransactionsFilterSlice,
  TransactionFilterSlice,
} from './slices/transactionsFilterSlice';

type BoundStore = TransactionsSlice & BalanceSlice & TransactionFilterSlice;

export const useBoundStore = create<BoundStore>()((...a) => ({
  ...createTransactionsSlice(...a),
  ...createBalanceSlice(...a),
  ...createTransactionsFilterSlice(...a),
}));

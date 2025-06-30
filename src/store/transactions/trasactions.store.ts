import { ScreenStateEnum } from '@/enums/screenStates';
import { create } from 'zustand';
import { TransactionsStore } from './transactions.types';

export const useTransactionsStore = create<TransactionsStore>((set) => ({
  pageState: ScreenStateEnum.LOADING,
}));

import { getAllTransactions } from '@/services/transactions/getAllTransactions';
import { StateCreator } from 'zustand';
import { Database } from '../../../database.types';
import { ScreenStateEnum } from '../../enums/screenStates';

export interface IFilter {
  year?: number;
  month?: number;
  transactionType?: number;
}

export interface TransactionsSlice {
  transactionsState: keyof typeof ScreenStateEnum;
  transactions: Database['public']['Tables']['transactions']['Row'][];
  getTransactions: (user_id: string, filters?: IFilter) => Promise<void>;
}

export const createTransactionsSlice: StateCreator<TransactionsSlice, [], [], TransactionsSlice> = (
  set,
) => ({
  transactionsState: ScreenStateEnum.LOADING,
  transactions: [],
  getTransactions: async (database, filters) => {
    try {
      set(() => ({ transactionsState: ScreenStateEnum.LOADING }));
      const response = await getAllTransactions(database, filters);
      set(() => ({ transactions: response.data, transactionsState: ScreenStateEnum.DEFAULT }));
    } catch (error) {
      console.log('Error on getTransactions', error);
      set(() => ({ transactionsState: ScreenStateEnum.ERROR }));
    }
  },
});

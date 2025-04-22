import { StateCreator } from 'zustand';
import { ScreenStateEnum } from '../../enums/screenStates';
import { Transaction } from '../../database/types';
import { SQLiteDatabase } from 'expo-sqlite';
import { FilterParams, getAllTransactions } from '../../database/transactions/getAllTransactions';

export interface TransactionsSlice {
  transactionsState: keyof typeof ScreenStateEnum;
  transactions: Transaction[];
  getTransactions: (database: SQLiteDatabase, filters?: FilterParams) => Promise<void>;
}

export const createTransactionsSlice: StateCreator<TransactionsSlice, [], [], TransactionsSlice> = (
  set,
) => ({
  transactionsState: ScreenStateEnum.LOADING,
  transactions: [],
  getTransactions: async (database, filters) => {
    set(() => ({ transactionsState: ScreenStateEnum.LOADING }));
    getAllTransactions(database, filters)
      .then((response) => {
        set(() => ({ transactions: response, transactionsState: ScreenStateEnum.DEFAULT }));
      })
      .catch((error) => {
        console.log('Error on getTransactions', error);
        set(() => ({ transactionsState: ScreenStateEnum.ERROR }));
      });
  },
});

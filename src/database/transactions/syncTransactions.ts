import { supabase } from '@/services/supabase';
import { openDatabaseAsync } from 'expo-sqlite';
import { Transaction } from '../types';
import { getPendingTransactions } from './getPendingTransactions';
import { markSyncTransactions } from './markTransactionsAsSync';
import { removeDeletedTransactions } from './removeDeletedTransactions';
import { upsertTransactionsFromServer } from './upsertTransactionsFromServer';

export async function syncTransactions() {
  const db = await openDatabaseAsync('my-expenses.db');

  const pendingTransactions = await getPendingTransactions(db);
  const markPendingTransactions = pendingTransactions.map((transaction) => ({
    ...transaction,
    pendingSync: 0,
    deleted: transaction.deleted === 1,
  }));

  if (pendingTransactions.length > 0) {
    try {
      const response = await supabase.from('transactions').upsert(markPendingTransactions);

      if (response?.error?.details) {
        throw new Error('Cant sync with error' + response?.error?.code);
      }
      const syncedIds = pendingTransactions.map((transaction) => transaction.id);

      await markSyncTransactions(db, syncedIds);
    } catch (error) {
      console.log('Error when sync transactions');
      console.log(error);
    }
  }

  try {
    const serverTransactions = await supabase.from('transactions').select();
    upsertTransactionsFromServer(db, serverTransactions.data as Transaction[]);

    await removeDeletedTransactions(db);
  } catch (error) {
    console.log('error finding updates');
    console.log(error);
  }

  console.log('sync');
}

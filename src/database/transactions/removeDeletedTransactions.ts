import { supabase } from '@/services/supabase';
import { SQLiteDatabase } from 'expo-sqlite';

export async function removeDeletedTransactions(db: SQLiteDatabase) {
  try {
    await db
      .runAsync(`DELETE FROM transactions WHERE deleted = 1`)
      .then(() => console.log('Deletado localmente'));
    await supabase
      .from('transactions')
      .delete()
      .eq('deleted', true)
      .then(() => console.log('Deletado do Supabase'));
  } catch (error) {
    throw error;
  }
}

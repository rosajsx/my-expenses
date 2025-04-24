import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';
import { getAllTransactions } from './getAllTransactions';

export async function upsertTransactionsFromServer(
  db: SQLiteDatabase,
  transactions: Transaction[],
) {
  const data = await getAllTransactions(db);
  console.log({ data });

  return db.withTransactionAsync(async () => {
    console.log(transactions.length);
    transactions.forEach(async (transaction) => {
      console.log([transaction.id]);
      await db
        .runAsync(
          `UPDATE transactions SET  name = ?, amount = ?, type = ?, installment = ?, installment_qtd = ?, date = ?, pendingSync = ?, created_at = ?, updated_at = ?, deleted = ? WHERE id = ? AND user_id = ?`,
          transaction.name,
          transaction.amount,
          transaction.type,
          transaction.installment || null,
          transaction.installment_qtd || null,
          transaction.date,
          transaction.pendingSync!,
          transaction.created_at || null,
          transaction.updated_at || null,
          transaction.deleted ? 0 : 1,
          transaction.id,
          transaction.user_id,
        )
        .then((response) => {
          console.log('upsert do server');
          console.log(response.lastInsertRowId, response.changes);
        })
        .catch((error) => {
          console.log('deu erro', error);
        });
    });
  });
}

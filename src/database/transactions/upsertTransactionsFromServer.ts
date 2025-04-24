import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';

export async function upsertTransactionsFromServer(
  db: SQLiteDatabase,
  transactions: Transaction[],
) {
  return db.withTransactionAsync(async () => {
    transactions.forEach(async (transaction) => {
      await db
        .runAsync(
          `INSERT OR REPLACE INTO transactions (id, user_id,name, amount, type, installment, installment_qtd, date, pendingSync, created_at, updated_at, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          transaction.id,
          transaction.user_id,
          transaction.name,
          transaction.amount,
          transaction.type,
          transaction.installment || null,
          transaction.installment_qtd || null,
          transaction.date,
          transaction.pendingSync!,
          transaction.created_at || null,
          transaction.updated_at || null,
          transaction.deleted ? 1 : 0,
        )
        .then((response) => {
          console.log('upsert do server');
        })
        .catch((error) => {
          console.log('deu erro', error);
        });
    });
  });
}

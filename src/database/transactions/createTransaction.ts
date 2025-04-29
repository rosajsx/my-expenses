import { SQLiteDatabase } from 'expo-sqlite';
import { Transaction } from '../types';
import { updateCachedBalance } from '../accountSummary/updateCachedBalance';
import { formatDateForSQLite } from '@/src/utils';
import Storage from 'expo-sqlite/kv-store';
import * as Crypto from 'expo-crypto';

export async function createTransaction(
  db: SQLiteDatabase,
  {
    name,
    amount,
    installment,
    date,
    type,
    installment_qtd,
    category,
  }: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted'>,
) {
  try {
    const transactions: Omit<Transaction, 'created_at' | 'updated_at' | 'deleted'>[] = [];

    const user_id = await Storage.getItem('my-expenses-user-hash');

    if (!user_id) {
      throw new Error('User Hash not found');
    }

    const formattedDate = formatDateForSQLite(new Date(date));

    if (installment_qtd && installment) {
      const baseDate = new Date(date);
      const id = Crypto.randomUUID();
      const restInstallments = installment_qtd - installment;

      transactions.push({
        id,
        name,
        amount,
        installment,
        installment_qtd,
        date: formattedDate,
        user_id,
        type,
        category,
      });

      for (let i = 0; i < restInstallments; i++) {
        const newDate = new Date(date);
        newDate.setMonth(baseDate.getMonth() + (i + 1));
        const newId = Crypto.randomUUID();

        transactions.push({
          id: newId,
          name,
          amount,
          installment: installment + (i + 1),
          installment_qtd,
          date: formatDateForSQLite(newDate),
          user_id,
          type,
          category,
        });
      }
    } else {
      const id = Crypto.randomUUID();

      transactions.push({
        id,
        name,
        amount,
        installment,
        installment_qtd,
        date: formattedDate,
        user_id,
        type,
        category,
      });
    }

    await db.withTransactionAsync(async () => {
      transactions.forEach(async (transaction) => {
        await createTransactionQuery(db, transaction);
        await updateCachedBalance(
          db,
          transaction.type === 1 ? transaction.amount : -transaction.amount,
        );
      });
    });
  } catch (error) {
    throw error;
  }
}

async function createTransactionQuery(
  db: SQLiteDatabase,
  {
    id,
    name,
    amount,
    installment,
    date,
    type,
    installment_qtd,
    user_id,
    category,
  }: Omit<Transaction, 'created_at' | 'updated_at' | 'deleted'>,
) {
  return db.runAsync(
    `INSERT OR REPLACE INTO transactions (id,name, amount, installment, type, date, installment_qtd, pendingSync, user_id, created_at, deleted, category) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    name,
    amount,
    installment,
    type,
    date,
    installment_qtd,
    1,
    user_id,
    new Date().toISOString(),
    0,
    category,
  );
}

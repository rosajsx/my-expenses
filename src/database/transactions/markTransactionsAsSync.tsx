import { SQLiteDatabase } from 'expo-sqlite';

export async function markSyncTransactions(db: SQLiteDatabase, ids: string[]) {
  if (ids.length === 0) return;

  return await db.withTransactionSync(async () => {
    const placeholders = ids.map(() => '?').join(',');
    await db.runAsync(`UPDATE transactions SET pendingSync = 0 WHERE id IN (${placeholders})`, [
      ...ids,
    ]);
  });
}

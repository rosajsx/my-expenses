import { getDB } from '../sqlite';

export const deleteTransactionById = async (user_id: string, transactionID: number) => {
  const db = await getDB();
  await db.runAsync('DELETE FROM transactions WHERE id = ? AND user_id = ?', [transactionID, user_id]);
  return { data: null, error: null };
};

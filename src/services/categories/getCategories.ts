import { getDB } from '../sqlite';

export async function getCategories() {
  const db = await getDB();
  const data = await db.getAllAsync('SELECT id, name FROM categories');
  return { data, error: null };
}

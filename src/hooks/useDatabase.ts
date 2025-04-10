import { useSQLiteContext } from 'expo-sqlite';

export const useDatabase = () => {
  const database = useSQLiteContext();

  if (!database) {
    throw new Error('useDatabase must be used within a SQLiteProvider');
  }

  return { database };
};

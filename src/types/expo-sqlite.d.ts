declare module 'expo-sqlite' {
  export interface SQLiteDatabase {
    execAsync(sql: string): Promise<void>;
    getAllAsync<T = any>(sql: string, params?: any[]): Promise<T[]>;
    runAsync(sql: string, params?: any[]): Promise<void>;
  }
  export function openDatabaseAsync(name: string): Promise<SQLiteDatabase>;
}

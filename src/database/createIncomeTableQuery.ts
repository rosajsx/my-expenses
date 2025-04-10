export const createIncomeTableQuery = `
  PRAGMA journal_mode = 'wal';
  CREATE TABLE IF NOT EXISTS incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    type INTEGER NOT NULL,
    installment INTEGER,
    date TEXT NOT NULL
    )
`;

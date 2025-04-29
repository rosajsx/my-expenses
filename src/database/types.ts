export interface Transaction {
  id: string;
  name: string;
  user_id: string;
  amount: number;
  type: number;
  installment: number | null;
  installment_qtd: number | null;
  date: string;
  pendingSync?: number;
  created_at: string;
  updated_at: string;
  deleted: number;
  category: string;
}

export interface AccountSummary {
  id: number;
  total: number;
  last_updated: string;
}

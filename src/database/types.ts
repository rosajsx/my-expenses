export interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: number;
  installment: number | null;
  installment_qtd: number | null;
  date: string;
}

export interface AccountSummary {
  id: number;
  total: number;
  last_updated: string;
}

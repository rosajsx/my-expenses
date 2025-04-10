export interface Income {
  id: number;
  name: string;
  amount: number;
  type: number;
  installment: number | null;
  installmentQtd: number | null;
  date: string;
}

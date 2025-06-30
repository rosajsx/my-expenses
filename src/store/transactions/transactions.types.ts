import { ScreenStateEnum } from '@/enums/screenStates';
import { Database } from '../../../database.types';

export type ITransaction = Database['public']['Tables']['transactions']['Row'];

export interface TransactionsStore {
  pageState: keyof typeof ScreenStateEnum;
}

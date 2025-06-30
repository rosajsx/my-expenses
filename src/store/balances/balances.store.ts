import { ScreenStateEnum } from '@/enums/screenStates';
import { create } from 'zustand';
import { BalanceStore } from './balances.type';

export const useBalancesStore = create<BalanceStore>((set) => ({
  state: ScreenStateEnum.LOADING,
  setState: (value) => set(() => ({ state: value })),
}));

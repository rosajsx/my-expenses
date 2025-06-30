import { ScreenStateEnum } from '@/enums/screenStates';

export interface BalanceStore {
  state: keyof typeof ScreenStateEnum;
  setState: (value: keyof typeof ScreenStateEnum) => void;
}

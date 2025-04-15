import { useState } from 'react';
import { ScreenStateEnum } from '../enums/screenStates';

export const useScreenState = () => {
  const [screenState, setScreenState] = useState<ScreenStateEnum>(ScreenStateEnum.DEFAULT);

  const handleChangeScreenStateToDefault = () => setScreenState(ScreenStateEnum.DEFAULT);
  const handleChangeScreenStateToLoading = () => setScreenState(ScreenStateEnum.LOADING);
  const handleChangeScreenStateToError = () => setScreenState(ScreenStateEnum.ERROR);
  const handleChangeScreenStateToSuccess = () => setScreenState(ScreenStateEnum.SUCCESS);

  const isScreenStateDefault = screenState === ScreenStateEnum.DEFAULT;
  const isScreenStateLoading = screenState === ScreenStateEnum.LOADING;
  const isScreenStateError = screenState === ScreenStateEnum.ERROR;
  const isScreenStateSuccess = screenState === ScreenStateEnum.SUCCESS;

  return {
    screenState,
    isScreenStateDefault,
    isScreenStateLoading,
    isScreenStateError,
    isScreenStateSuccess,
    handleChangeScreenStateToDefault,
    handleChangeScreenStateToLoading,
    handleChangeScreenStateToError,
    handleChangeScreenStateToSuccess,
  };
};

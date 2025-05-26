import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { BackdropPressBehavior } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useCallback, useRef, useState } from 'react';

interface UseBottomSheetProps {
  pressBehavior?: BackdropPressBehavior | undefined;
}

export const useBottomSheet = ({ pressBehavior = 'close' }: UseBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [sheetIndex, setSheetIndex] = useState(-1);

  const openSheet = () => {
    bottomSheetRef?.current?.expand();
    setSheetIndex(0);
  };
  const closeSheet = () => {
    bottomSheetRef?.current?.close();

    setSheetIndex(-1);
  };

  const updateSheetIndex = (value: number) => setSheetIndex(value);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior={pressBehavior}
      />
    ),
    [],
  );

  return {
    bottomSheetRef,
    openSheet,
    closeSheet,
    sheetIndex,
    renderBackdrop,
    updateSheetIndex,
  };
};

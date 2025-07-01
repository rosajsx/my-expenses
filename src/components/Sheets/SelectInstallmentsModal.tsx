import { useBottomSheet } from '@/hooks/useBottomSheet';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Portal } from 'react-native-portalize';
import { Button } from '../Button';

const quantitiesOfInstallments = new Array(48).fill(null).map((item, index) => {
  return index + 1;
});

interface SelectInstallmentsModalProps {
  isOpen: boolean;
  toggleSheet: () => void;
  installmentQtd: string | null | undefined;
  setInstallmentQtd: (value: string | null) => void;
}

export const SelectInstallmentsModal = ({
  isOpen,
  installmentQtd,
  setInstallmentQtd,
  toggleSheet,
}: SelectInstallmentsModalProps) => {
  const { bottomSheetRef, closeSheet, openSheet, updateSheetIndex, renderBackdrop, sheetIndex } =
    useBottomSheet({});
  const snapPoints = useMemo(() => ['40%'], []);

  useEffect(() => {
    if (isOpen) {
      openSheet();
    }
  }, [isOpen]);

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose
        index={sheetIndex}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={(value) => {
          if (value === -1) {
            toggleSheet();
          }

          updateSheetIndex(value);
        }}>
        <BottomSheetView style={styles.modalContent}>
          <Picker
            selectedValue={installmentQtd}
            onValueChange={(value) => {
              console.log({ value });
              setInstallmentQtd(value);
            }}>
            {quantitiesOfInstallments.map((item) => (
              <Picker.Item key={item} label={item.toString()} value={item} />
            ))}
          </Picker>

          <Button
            title="Fechar"
            onPress={() => {
              toggleSheet();
              closeSheet();
            }}
          />
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 24,
  },
});

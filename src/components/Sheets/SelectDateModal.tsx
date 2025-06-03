import { useBottomSheet } from '@/hooks/useBottomSheet';
import { colors } from '@/styles/colors';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Portal } from 'react-native-portalize';
import { Button } from '../Button';

interface SelectDateModalProps {
  isOpen: boolean;
  toggleSheet: () => void;
  selectedDate: Date;
  setSelectedDate: (value: Date) => void;
}

export const SelectDateModal = ({
  isOpen,
  selectedDate,
  setSelectedDate,
  toggleSheet,
}: SelectDateModalProps) => {
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
          <DateTimePicker
            display="spinner"
            mode="date"
            value={selectedDate}
            textColor={colors.text}
            onChange={(_, date) => {
              setSelectedDate(date!);
            }}
          />

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

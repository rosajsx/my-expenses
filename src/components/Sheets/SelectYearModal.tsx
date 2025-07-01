import { useBottomSheet } from '@/hooks/useBottomSheet';
import { colors } from '@/styles/colors';
import { getLast5Years } from '@/utils';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Portal } from 'react-native-portalize';

const years = getLast5Years();

interface SelectYearModalProps {
  selectedYear: string | undefined;
  setSelectedYear: (value: string) => void;
  isSelectYearModalOpen: boolean;
  handleCloseSelectYearModal: () => void;
}

export const SelectYearModal = ({
  selectedYear,
  setSelectedYear,
  isSelectYearModalOpen,
  handleCloseSelectYearModal,
}: SelectYearModalProps) => {
  const [localYear, setLocalYear] = useState(selectedYear);
  const { bottomSheetRef, closeSheet, openSheet, updateSheetIndex, renderBackdrop, sheetIndex } =
    useBottomSheet({});

  const snapPoints = useMemo(() => ['40%'], []);

  const handleSelect = () => {
    setSelectedYear(localYear!);
    handleCloseSelectYearModal();
    closeSheet();
  };

  useEffect(() => {
    if (isSelectYearModalOpen) {
      openSheet();
    }
  }, [isSelectYearModalOpen]);

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={(value) => {
          if (value === -1) {
            handleCloseSelectYearModal();
          }

          updateSheetIndex(value);
        }}
        enablePanDownToClose
        index={sheetIndex}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}>
        <BottomSheetView style={styles.modalContent}>
          <Picker
            selectedValue={localYear}
            itemStyle={styles.item}
            onValueChange={(value) => {
              setLocalYear(value);
            }}>
            <Picker.Item label="Todos" value={''} />
            {years.map((year) => (
              <Picker.Item key={year} label={`${year}`} value={year} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSelect}>
            <Text style={styles.saveBtnLabel}>Salvar</Text>
          </TouchableOpacity>
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
  item: {
    fontFamily: 'Inter_400Regular',
    fontWeight: 400,
    color: colors.text,
  },
  saveBtn: {
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  saveBtnLabel: {
    fontFamily: 'Inter_500Medium',
    fontWeight: 500,
    fontSize: 17,
    color: colors.white,
  },
});

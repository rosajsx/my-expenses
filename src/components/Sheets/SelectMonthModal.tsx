import { useBottomSheet } from '@/hooks/useBottomSheet';
import { colors } from '@/styles/colors';
import { getAllMonthsOfYear } from '@/utils';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Portal } from 'react-native-portalize';
import { useShallow } from 'zustand/react/shallow';
import { useBoundStore } from '../../store';

const months = getAllMonthsOfYear();

export const SelectMonthModal = () => {
  const { selectedMonth, setSelectedMonth, isSelectMonthModalOpen, closeSelectMonthModal } =
    useBoundStore(
      useShallow((state) => ({
        selectedMonth: state.selectedMonth,
        setSelectedMonth: state.setSelectedMonth,
        isSelectMonthModalOpen: state.isSelectMonthModalOpen,
        closeSelectMonthModal: state.handleCloseSelectMonthModal,
      })),
    );

  const { bottomSheetRef, closeSheet, openSheet, updateSheetIndex, renderBackdrop, sheetIndex } =
    useBottomSheet({});

  const snapPoints = useMemo(() => ['40%'], []);

  const [localMonth, setLocalMonth] = useState(selectedMonth);

  const handleSelect = () => {
    setSelectedMonth(localMonth!);
    closeSelectMonthModal();
    closeSheet();
  };

  useEffect(() => {
    if (isSelectMonthModalOpen) {
      openSheet();
    }
  }, [isSelectMonthModalOpen]);

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={(value) => {
          if (value === -1) {
            closeSelectMonthModal();
          }

          updateSheetIndex(value);
        }}
        enablePanDownToClose
        index={sheetIndex}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}>
        <BottomSheetView style={styles.modalContent}>
          <Picker
            selectedValue={localMonth?.id}
            itemStyle={styles.item}
            onValueChange={(value) => {
              setLocalMonth(months[value]);
            }}>
            <Picker.Item label="Todos" value={''} />
            {months.map((month) => (
              <Picker.Item key={month.id} label={month.value} value={month.id} />
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
    color: colors.backgroundWhite,
  },
});

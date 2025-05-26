import { colors } from '@/styles/colors';
import { getAllMonthsOfYear } from '@/utils';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ModalProps, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useBoundStore } from '../../store';

const months = getAllMonthsOfYear();
interface SelectMonthModalProps extends ModalProps {}

export const SelectMonthModal = ({ ...rest }: SelectMonthModalProps) => {
  const { selectedMonth, setSelectedMonth, isSelectMonthModalOpen, closeSelectMonthModal } =
    useBoundStore(
      useShallow((state) => ({
        selectedMonth: state.selectedMonth,
        setSelectedMonth: state.setSelectedMonth,
        isSelectMonthModalOpen: state.isSelectMonthModalOpen,
        closeSelectMonthModal: state.handleCloseSelectMonthModal,
      })),
    );

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%'], []);

  const [localMonth, setLocalMonth] = useState(selectedMonth);
  const [sheetIndex, setSheetIndex] = useState(-1);

  const openSheet = () => setSheetIndex(0);
  const closeSheet = () => setSheetIndex(-1);

  const handleSelect = () => {
    setSelectedMonth(localMonth!);
    closeSelectMonthModal();
    bottomSheetRef.current?.close();
    closeSheet();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  useEffect(() => {
    if (isSelectMonthModalOpen) {
      bottomSheetRef.current?.expand();
    }
  }, [isSelectMonthModalOpen]);

  console.log(sheetIndex);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={(value) => {
        if (value === -1) {
          closeSelectMonthModal();
        }

        setSheetIndex(value);
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

import { colors } from '@/styles/colors';
import { getLast5Years } from '@/utils';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ModalProps, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useBoundStore } from '../../store';
import { BotttomSheet, useBottomSheet } from '../BottomSheet';

const years = getLast5Years();

interface SelectYearModalProps extends ModalProps {}

export const SelectYearModal = ({ ...rest }: SelectYearModalProps) => {
  const { selectedYear, setSelectedYear, isSelectYearModalOpen, closeSelectYearModal } =
    useBoundStore(
      useShallow((state) => ({
        selectedYear: state.selectedYear,
        setSelectedYear: state.setSelectedYear,
        isSelectYearModalOpen: state.isSelectYearModalOpen,
        closeSelectYearModal: state.handleCloseSelectYearModal,
      })),
    );

  const { isOpen, toggleSheet } = useBottomSheet();
  const [localYear, setLocalYear] = useState(selectedYear);

  const handleClose = () => {
    closeSelectYearModal();
    toggleSheet();
  };

  const handleSelect = () => {
    setSelectedYear(localYear!);
    closeSelectYearModal();
    toggleSheet();
  };

  useEffect(() => {
    isOpen.value = isSelectYearModalOpen;
  }, [isSelectYearModalOpen]);

  return (
    <BotttomSheet isOpen={isOpen} toggleSheet={handleClose}>
      <View style={styles.modalContent}>
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
      </View>
    </BotttomSheet>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    height: '100%',
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

import { theme } from '@/styles/theme';
import { getLast5Years } from '@/utils';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect } from 'react';
import { ModalProps, StyleSheet, View } from 'react-native';
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

  const handleClose = () => {
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
          selectedValue={selectedYear}
          onValueChange={(value) => {
            setSelectedYear(value);
          }}>
          <Picker.Item label="Todos" value={''} />
          {years.map((year) => (
            <Picker.Item key={year} label={`${year}`} value={year} />
          ))}
        </Picker>
      </View>
    </BotttomSheet>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    height: '100%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
});

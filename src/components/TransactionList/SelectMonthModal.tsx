import { theme } from '@/styles/theme';
import { getAllMonthsOfYear } from '@/utils';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect } from 'react';
import { ModalProps, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useBoundStore } from '../../store';
import { BotttomSheet, useBottomSheet } from '../BottomSheet';

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

  const { isOpen, toggleSheet } = useBottomSheet();
  const handleClose = () => {
    closeSelectMonthModal();
    toggleSheet();
  };

  useEffect(() => {
    isOpen.value = isSelectMonthModalOpen;
  }, [isSelectMonthModalOpen]);

  return (
    <BotttomSheet isOpen={isOpen} toggleSheet={handleClose}>
      <View style={styles.modalContent}>
        <Picker
          selectedValue={selectedMonth?.id}
          onValueChange={(value) => {
            setSelectedMonth(months[value]);
          }}>
          <Picker.Item label="Todos" value={''} />
          {months.map((month) => (
            <Picker.Item key={month.id} label={month.value} value={month.id} />
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

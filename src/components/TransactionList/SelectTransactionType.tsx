import { colors } from '@/styles/colors';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ModalProps, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBoundStore } from '../../store';
import { BotttomSheet, useBottomSheet } from '../BottomSheet';

interface TransactionTypeModalProps extends ModalProps {}

export const TransactionTypeModal = ({ ...rest }: TransactionTypeModalProps) => {
  const selectedTransactionType = useBoundStore((state) => state.selectedTransactionType);
  const setTransactionTypeFilter = useBoundStore((state) => state.setTransactionTypeFilter);
  const isTransactionTypeFilterOpen = useBoundStore((state) => state.isTransactionTypeFilterOpen);
  const handleCloseTransactionTypeModal = useBoundStore(
    (state) => state.handleCloseTransactionTypeModal,
  );

  const { isOpen, toggleSheet } = useBottomSheet();
  const [localTransactionType, setLocalTransactionType] = useState(selectedTransactionType);

  const handleClose = () => {
    handleCloseTransactionTypeModal();
    toggleSheet();
  };

  const handleSelect = () => {
    setTransactionTypeFilter(localTransactionType);
    handleCloseTransactionTypeModal();
    toggleSheet();
  };

  useEffect(() => {
    isOpen.value = isTransactionTypeFilterOpen;
  }, [isTransactionTypeFilterOpen]);

  return (
    <BotttomSheet isOpen={isOpen} toggleSheet={handleClose}>
      <View style={styles.modalContent}>
        <Picker
          selectedValue={localTransactionType}
          itemStyle={styles.item}
          onValueChange={(value) => {
            setLocalTransactionType(value);
          }}>
          <Picker.Item label="Todos" value={''} />
          <Picker.Item label="Entradas" value={1} />
          <Picker.Item label="Saidas" value={2} />
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

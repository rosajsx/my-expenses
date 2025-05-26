import { useBottomSheet } from '@/hooks/useBottomSheet';
import { colors } from '@/styles/colors';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Portal } from 'react-native-portalize';
import { useBoundStore } from '../../store';

export const TransactionTypeModal = () => {
  const selectedTransactionType = useBoundStore((state) => state.selectedTransactionType);
  const setTransactionTypeFilter = useBoundStore((state) => state.setTransactionTypeFilter);
  const isTransactionTypeFilterOpen = useBoundStore((state) => state.isTransactionTypeFilterOpen);
  const handleCloseTransactionTypeModal = useBoundStore(
    (state) => state.handleCloseTransactionTypeModal,
  );

  const [localTransactionType, setLocalTransactionType] = useState(selectedTransactionType);
  const { bottomSheetRef, closeSheet, openSheet, updateSheetIndex, renderBackdrop, sheetIndex } =
    useBottomSheet({});
  const snapPoints = useMemo(() => ['40%'], []);

  const handleSelect = () => {
    setTransactionTypeFilter(localTransactionType);
    handleCloseTransactionTypeModal();
    closeSheet();
  };

  useEffect(() => {
    if (isTransactionTypeFilterOpen) {
      openSheet();
    }
  }, [isTransactionTypeFilterOpen]);

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={(value) => {
          if (value === -1) {
            handleCloseTransactionTypeModal();
          }

          updateSheetIndex(value);
        }}
        enablePanDownToClose
        index={sheetIndex}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}>
        <BottomSheetView style={styles.modalContent}>
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

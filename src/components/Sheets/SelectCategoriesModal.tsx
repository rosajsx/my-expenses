import { useBottomSheet } from '@/hooks/useBottomSheet';
import { ICategory } from '@/store/transactions/transactions.types';
import { colors } from '@/styles/colors';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Portal } from 'react-native-portalize';
import { Button } from '../Button';
import { Typography } from '../Typography';

interface SelectCategoriesModalProps {
  isOpen: boolean;
  toggleSheet: () => void;
  categories: ICategory[];
  setSelectedCategory: (data: ICategory) => void;
  value: ICategory | null;
}

export const SelectCategoriesModal = ({
  isOpen,
  toggleSheet,
  categories,
  value,
  setSelectedCategory,
}: SelectCategoriesModalProps) => {
  const { bottomSheetRef, closeSheet, openSheet, updateSheetIndex, renderBackdrop, sheetIndex } =
    useBottomSheet({});
  const snapPoints = useMemo(() => ['50%'], []);

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
          <FlatList
            data={categories}
            contentContainerStyle={styles.container}
            style={styles.list}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => setSelectedCategory(item)}
                  style={[
                    styles.categoryItem,
                    value?.id === item.id && styles.categoryItemSelected,
                  ]}>
                  <Typography variant="heading/sm" color={value?.id === item.id ? 'white' : 'text'}>
                    {item.name}
                  </Typography>
                </TouchableOpacity>
              );
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
    gap: 16,
  },

  categoryItemSelected: {
    backgroundColor: colors.primary,
  },
  categoryItem: {
    padding: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
  },
  list: {
    maxHeight: 350,
  },
  container: {
    gap: 4,
  },
});

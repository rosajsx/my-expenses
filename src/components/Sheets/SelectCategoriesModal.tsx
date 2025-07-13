import { useBottomSheet } from '@/hooks/useBottomSheet';
import { ICategory } from '@/store/transactions/transactions.types';
import { colors } from '@/styles/colors';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Portal } from 'react-native-portalize';
import { Button } from '../Button';

interface SelectCategoriesModalProps {
  isOpen: boolean;
  toggleSheet: () => void;
  categories: ICategory[];
  setSelectedCategory: (data: ICategory) => void;
  value: ICategory | null;
  enableAllCategories?: boolean;
}

export const SelectCategoriesModal = ({
  isOpen,
  toggleSheet,
  categories,
  value,
  setSelectedCategory,
  enableAllCategories = false,
}: SelectCategoriesModalProps) => {
  const { bottomSheetRef, closeSheet, openSheet, updateSheetIndex, renderBackdrop, sheetIndex } =
    useBottomSheet({});
  const snapPoints = useMemo(() => ['40%'], []);

  const [localCategory, setLocalCategory] = useState(value);

  const handleSelect = () => {
    setSelectedCategory(localCategory!);
    toggleSheet();
    closeSheet();
  };

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
          <Picker
            selectedValue={localCategory?.id}
            itemStyle={styles.item}
            onValueChange={(value) => {
              const selectedCategory = categories.find((category) => category.id === value);
              setLocalCategory(selectedCategory || null);
            }}>
            {enableAllCategories && <Picker.Item label="Todas as categorias" value={null} />}

            {categories.map((category) => (
              <Picker.Item
                key={category.id}
                label={category.name || 'Não Mapeado'}
                value={category.id}
              />
            ))}
          </Picker>
          <Button title="Salvar" onPress={handleSelect} />
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
  item: {
    fontFamily: 'Inter_400Regular',
    fontWeight: 400,
    color: colors.text,
  },
});

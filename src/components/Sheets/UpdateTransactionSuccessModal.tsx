import { useBottomSheet } from '@/hooks/useBottomSheet';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Portal } from 'react-native-portalize';
import { Button } from '../Button';
import { Typography } from '../Typography';

interface UpdateTransactionSuccessModalProps {
  isOpen: boolean;
  toggleSheet: () => void;
}

export const UpdateTransactionSuccessModal = ({
  isOpen,
  toggleSheet,
}: UpdateTransactionSuccessModalProps) => {
  const { bottomSheetRef, closeSheet, openSheet, updateSheetIndex, renderBackdrop, sheetIndex } =
    useBottomSheet({});
  const snapPoints = useMemo(() => ['40%'], []);

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
          <Typography align="center" variant="heading/md" style={{ marginBottom: 24 }}>
            Transação atualizada com sucesso!
          </Typography>

          <Button
            title="Fechar"
            onPress={() => {
              router.back();
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});

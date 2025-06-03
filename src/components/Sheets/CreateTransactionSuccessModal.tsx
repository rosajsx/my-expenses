import { useBottomSheet } from '@/hooks/useBottomSheet';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Portal } from 'react-native-portalize';
import { Button } from '../Button';
import { Typography } from '../Typography';

interface CreateTransactionSuccessModalProps {
  isOpen: boolean;
  toggleSheet: () => void;
  onReset?: () => void;
}

export const CreateTransactionSuccessModal = ({
  isOpen,
  toggleSheet,
  onReset,
}: CreateTransactionSuccessModalProps) => {
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
          <Typography align="center" variant="heading/md">
            Transação salva com sucesso!
          </Typography>
          <Typography align="center" variant="body/md" style={{ marginBottom: 12 }}>
            O que deseja fazer agora?
          </Typography>

          <Button
            variant="primary"
            title="Criar nova transação"
            onPress={() => {
              onReset?.();
              closeSheet();
            }}
          />
          <Button
            variant="ghost"
            title="Fechar"
            onPress={() => {
              closeSheet();
              router.back();
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
    gap: 12,
  },
});

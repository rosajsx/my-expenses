import { theme } from '@/styles/theme';
import { getLast5Years } from '@/utils';
import { Picker } from '@react-native-picker/picker';
import { X } from 'lucide-react-native';
import { Modal, SafeAreaView, View, Pressable, ModalProps, StyleSheet } from 'react-native';
import { useBoundStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';

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

  return (
    <Modal
      transparent
      visible={isSelectYearModalOpen}
      onRequestClose={closeSelectYearModal}
      {...rest}>
      <SafeAreaView style={styles.modalView}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Pressable onPress={closeSelectYearModal}>
              <X />
            </Pressable>
          </View>
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
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: theme.colors.black50,
  },
  modalContent: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    width: '80%',
  },
  modalHeader: {
    width: '100%',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
  },
});

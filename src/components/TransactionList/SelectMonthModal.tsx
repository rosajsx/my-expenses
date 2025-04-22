import { Picker } from '@react-native-picker/picker';
import { X } from 'lucide-react-native';
import { Modal, ModalProps, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { useBoundStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';
import { getAllMonthsOfYear, getLast5Years } from '@/src/utils';
import { theme } from '@/src/styles/theme';

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

  return (
    <Modal
      {...rest}
      transparent
      visible={isSelectMonthModalOpen}
      onRequestClose={closeSelectMonthModal}>
      <SafeAreaView style={styles.modalView}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Pressable onPress={closeSelectMonthModal}>
              <X />
            </Pressable>
          </View>
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

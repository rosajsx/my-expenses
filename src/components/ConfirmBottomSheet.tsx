import { StyleSheet, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { BotttomSheet } from './BottomSheet';

interface ConfirmBottomSheetProps {
  isOpen: SharedValue<boolean>;
  toggleSheet: () => void;
}

export const ConfirmBottomSheet = ({ isOpen, toggleSheet }: ConfirmBottomSheetProps) => {
  const handleClose = () => {
    toggleSheet();
  };

  return (
    <BotttomSheet isOpen={isOpen} toggleSheet={handleClose}>
      <View style={styles.content}></View>
    </BotttomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    height: '100%',
  },
});

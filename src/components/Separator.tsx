import { colors } from '@/styles/colors';
import { StyleSheet, View } from 'react-native';

export const Separator = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: colors.separator,
  },
});

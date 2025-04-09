import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

interface ContainerProps extends SafeAreaViewProps {}

export const Container = ({ children }: ContainerProps) => {
  return (
    <View style={styles.wrapper}>
      <StatusBar animated barStyle="light-content" />
      <SafeAreaView>{children}</SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.background,
    height: '100%',
    width: '100%',
  },
});

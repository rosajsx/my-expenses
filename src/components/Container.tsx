import { StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

interface ContainerProps extends SafeAreaViewProps {}

export const Container = ({ children, style, ...props }: ContainerProps) => {
  //const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.wrapper]}>
      <StatusBar animated barStyle="light-content" />
      <SafeAreaView {...props} style={[styles.container, style]}>
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.background,

    padding: theme.spacing.lg,
  },
  container: {
    height: '100%',
    width: '100%',
  },
});

import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

interface ContainerProps extends SafeAreaViewProps {
  wrapperStyle?: SafeAreaViewProps['style'];
}

export const Container = ({ children, style, wrapperStyle, ...props }: ContainerProps) => {
  //const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
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

    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  container: {
    height: '100%',
    width: '100%',
  },
});

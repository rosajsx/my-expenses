import { colors } from '@/styles/colors';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

interface ContainerProps extends SafeAreaViewProps {
  wrapperStyle?: SafeAreaViewProps['style'];
}

export const Container = ({ children, style, wrapperStyle, ...props }: ContainerProps) => {
  //const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <StatusBar animated barStyle="dark-content" />
      <SafeAreaView {...props} style={[styles.container, style]}>
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundWhite,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  container: {
    height: '100%',
    width: '100%',
  },
});

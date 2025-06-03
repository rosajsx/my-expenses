import { colors } from '@/styles/colors';
import { theme } from '@/styles/theme';
import { X } from 'lucide-react-native';
import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Typography } from './Typography';

interface BottomSheetProps {
  isOpen: SharedValue<boolean>;
  toggleSheet?: () => void;
  duration?: number;
  onClose?: () => void;
  containerHeight?: number;
  title?: string;
}

export function BottomSheet({
  isOpen,
  toggleSheet,
  children,
  duration = 500,
  onClose,
  containerHeight,
  title,
}: PropsWithChildren<BottomSheetProps>) {
  const height = useSharedValue(0);
  const progress = useDerivedValue(() => withTiming(isOpen.value ? 0 : 1, { duration }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * height.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isOpen.value ? 1 : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  const handleClose = () => {
    onClose?.();
    toggleSheet?.();
  };

  return (
    <>
      <Animated.View style={[sheetStyles.backdrop, backdropStyle]}>
        <TouchableOpacity style={sheetStyles.flex} onPress={handleClose} />
      </Animated.View>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[sheetStyles.sheet, sheetStyle]}>
        <View style={sheetStyles.content}>
          <View
            style={[
              sheetStyles.header,
              title ? sheetStyles.headerWithTitle : sheetStyles.headerWithoutTitle,
            ]}>
            {title && <Typography variant="section">{title}</Typography>}
            <Pressable onPress={handleClose}>
              <X color={colors.backgroundBlack} />
            </Pressable>
          </View>
          <View
            style={[
              sheetStyles.main,
              {
                height: containerHeight,
              },
            ]}>
            {children}
          </View>
        </View>
      </Animated.View>
    </>
  );
}

export const useBottomSheet = (initialValue = false) => {
  const isOpen = useSharedValue(initialValue);

  const toggleSheet = () => {
    isOpen.value = !isOpen.value;
  };

  return {
    isOpen,
    toggleSheet,
  };
};

const sheetStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  sheet: {
    minHeight: 150,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundWhite,
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.shadow,
  },
  content: {
    width: '100%',
    height: '100%',
  },
  header: {},
  headerWithoutTitle: {
    alignItems: 'flex-end',
  },
  headerWithTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  main: {
    flex: 1,
    padding: theme.spacing.md,
  },
});

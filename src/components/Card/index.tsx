import { colors } from '@/styles/colors';
import { StyleSheet, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  spacing?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
}

export const Card = ({
  style,
  spacing = 12,
  paddingVertical = 12,
  paddingHorizontal = 12,
  ...props
}: CardProps) => {
  return (
    <View
      {...props}
      style={[styles.container, { gap: spacing, paddingVertical, paddingHorizontal }, style]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '100%',
    minHeight: 44,
  },
});

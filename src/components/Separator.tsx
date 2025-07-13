import { colors, IColors } from '@/styles/colors';
import { StyleSheet, View, ViewProps } from 'react-native';

interface SeparatorProps {
  width?: number;
  color?: IColors;
  styles?: ViewProps['style'];
}

export const Separator = ({ width = 0.5, color = 'separator', styles }: SeparatorProps) => {
  const borderColor = colors[color];

  return <View style={[customStyles.separator, { borderWidth: width, borderColor }, styles]} />;
};

const customStyles = StyleSheet.create({
  separator: {
    width: '100%',
    borderRadius: 8,
  },
});

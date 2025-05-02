import { theme } from '@/styles/theme';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Typography } from '../Typography';
import { ArrowDown, ArrowUp, Calendar, Search } from 'lucide-react-native';
import { Colors } from '@/styles/types';

const Icons = {
  Calendar: Calendar,
  ArrowUp: ArrowUp,
  ArrowDown: ArrowDown,
  Search: Search,
};

interface FilterButtonProps {
  onPress: () => void;
  icon?: keyof typeof Icons;
  text?: string;
  iconColor: Colors;
  style: TouchableOpacityProps['style'];
}

export function FilterButton({ onPress, icon, text, iconColor, style }: FilterButtonProps) {
  const SelectedIcon = Icons[icon!];
  const color = theme.colors[iconColor];
  return (
    <TouchableOpacity style={[styles.filterItem, style]} onPress={onPress}>
      {SelectedIcon && <SelectedIcon color={color} size="20px" />}
      {text && <Typography>{text}</Typography>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterItem: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardBackground,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});

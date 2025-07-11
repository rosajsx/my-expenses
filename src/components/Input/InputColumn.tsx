import { colors } from '@/styles/colors';
import { LucideIcon } from 'lucide-react-native';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View, ViewProps } from 'react-native';
import { Separator } from '../Separator';
import { Typography } from '../Typography';

interface InputColumnProps extends TextInputProps {
  label?: string;
  separator?: boolean;
  wrapperStyle?: ViewProps['style'];
  Icon?: LucideIcon;
  iconAction?: () => void;
}

export const InputColumn = forwardRef<TextInput, InputColumnProps>(
  (
    {
      label,
      placeholderTextColor,
      style,
      separator = true,
      wrapperStyle,
      value,
      Icon,
      iconAction,
      ...props
    },
    ref,
  ) => {
    return (
      <View style={[styles.input, wrapperStyle]}>
        {label && (
          <Typography variant="body/md" color="text">
            {label}
          </Typography>
        )}

        {separator && label && <Separator />}

        <View style={styles.textContainer}>
          <TextInput
            {...props}
            ref={ref}
            placeholderTextColor={colors.textSecondary}
            style={[styles.textInput, style]}
            value={value}
          />
          {Icon && (
            <Pressable onPress={iconAction}>
              <Icon />
            </Pressable>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    gap: 12,
  },
  textInput: {
    fontSize: 17,
    fontFamily: 'Inter_400Regular',
    fontWeight: 400,
    textAlign: 'left',
    flex: 1,
  },
  textContainer: {
    flexDirection: 'row',
  },
});

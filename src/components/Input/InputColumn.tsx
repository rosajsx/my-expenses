import { colors } from '@/styles/colors';
import { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Separator } from '../Separator';
import { Typography } from '../Typography';

interface InputColumnProps extends TextInputProps {
  label: string;
}

export const InputColumn = forwardRef<TextInput, InputColumnProps>(
  (
    {
      label,
      placeholderTextColor,
      style,

      value,

      ...props
    },
    ref,
  ) => {
    return (
      <View style={[styles.input]}>
        <Typography variant="body/md" color="text">
          {label}
        </Typography>
        <Separator />
        <TextInput
          {...props}
          ref={ref}
          placeholderTextColor={colors.textSecondary}
          style={[styles.textInput, style]}
          value={value}
        />
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
  },
  withActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

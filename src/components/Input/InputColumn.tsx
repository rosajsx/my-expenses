import { colors } from '@/styles/colors';
import { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewProps } from 'react-native';
import { Separator } from '../Separator';
import { Typography } from '../Typography';

interface InputColumnProps extends TextInputProps {
  label?: string;
  separator?: boolean;
  wrapperStyle?: ViewProps['style'];
}

export const InputColumn = forwardRef<TextInput, InputColumnProps>(
  (
    { label, placeholderTextColor, style, separator = true, wrapperStyle, value, ...props },
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

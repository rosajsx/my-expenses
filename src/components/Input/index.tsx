import { colors } from '@/styles/colors';
import { ChevronRight } from 'lucide-react-native';
import { forwardRef, ReactNode } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Typography } from '../Typography';

interface InputProps extends TextInputProps {
  label: string;
  valueWithAction?: boolean;
  onAction?: () => void;
  RightComponent?: ReactNode;
  disabled?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      placeholderTextColor,
      style,
      valueWithAction,
      onAction,
      value,
      RightComponent,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <View style={[styles.input, disabled && styles.disabledField]}>
        <Typography variant="body/md" color="text">
          {label}
        </Typography>

        {RightComponent ? (
          RightComponent
        ) : (
          <>
            {valueWithAction ? (
              <TouchableOpacity style={[styles.withActionButton]} onPress={onAction}>
                <Typography variant="body/md">{value}</Typography>
                <ChevronRight color={colors.textSecondary} />
              </TouchableOpacity>
            ) : (
              <TextInput
                {...props}
                ref={ref}
                placeholderTextColor={colors.textSecondary}
                style={[styles.textInput, style]}
                value={value}
                editable={!disabled}
              />
            )}
          </>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
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
  disabledField: {
    pointerEvents: 'none',
    opacity: 0.5,
  },
});

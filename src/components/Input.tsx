import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { theme } from '../styles/theme';
import { forwardRef, LegacyRef, useState } from 'react';
import { Typography } from './Typography';
import { LucideIcon } from 'lucide-react-native';

const focusStyle = {
  borderWidth: 2,
  borderColor: theme.colors.primary,
};

const defaultStyle = {
  borderWidth: 1,
  borderColor: theme.colors.border,
};

interface InputProps extends TextInputProps {
  error?: boolean;
  errorText?: string;
  label?: string;
  LeftIcon?: LucideIcon;
}

const InputComponent = (
  {
    style,
    editable = true,
    error,
    onFocus,
    onBlur,
    label,
    errorText,
    LeftIcon,
    ...props
  }: InputProps,
  ref: any,
) => {
  const [borderStyle, setBorderStyle] = useState(defaultStyle);

  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="label" color={error ? 'error' : 'textSecondary'}>
          {label}
        </Typography>
      )}

      <View style={[styles.inputContainer, borderStyle]}>
        {LeftIcon && <LeftIcon />}
        <TextInput
          {...props}
          ref={ref}
          style={[styles.input, style, !editable && styles.disabled, error && styles.error]}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={(e) => {
            setBorderStyle(focusStyle);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setBorderStyle(defaultStyle);
            onBlur?.(e);
          }}
        />
      </View>

      {errorText && error && <Typography variant="error">{errorText}</Typography>}
    </View>
  );
};

export const Input = forwardRef(InputComponent);

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    flex: 1,
    fontSize: theme.fonts.sizes.text,
    color: theme.colors.textPrimary,
    minHeight: 48,
  },
  error: {
    borderColor: theme.colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
});

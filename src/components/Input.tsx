import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { theme } from '../styles/theme';
import { useState } from 'react';
import { Typography } from './Typography';

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
}

export const Input = ({
  style,
  editable = true,
  error,
  onFocus,
  onBlur,
  label,
  errorText,
  ...props
}: InputProps) => {
  const [borderStyle, setBorderStyle] = useState(defaultStyle);

  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="label" color={error ? 'error' : 'textSecondary'}>
          {label}
        </Typography>
      )}
      <TextInput
        {...props}
        style={[
          styles.input,
          borderStyle,
          style,
          !editable && styles.disabled,
          error && styles.error,
        ]}
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
      {errorText && error && <Typography variant="error">{errorText}</Typography>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,

    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
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

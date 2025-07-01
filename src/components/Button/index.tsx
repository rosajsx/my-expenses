import { colors } from '@/styles/colors';
import { forwardRef } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Typography, TypographyVariant } from '../Typography';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  title?: string;
  textVariant?: TypographyVariant;
  paddingHorizontal?: number;
}

const ButtonComponent = (
  {
    variant = 'primary',
    title,
    textVariant = 'button',
    disabled,
    style,
    children,
    paddingHorizontal = 16,
    ...props
  }: ButtonProps,
  ref: any,
) => {
  const variantStyle = variantStyles[variant];
  const textStyle = variantTextStyles[variant];
  return (
    <TouchableOpacity
      style={[styles.base, { paddingHorizontal }, variantStyle, disabled && styles.disabled, style]}
      ref={ref}
      testID="Button"
      activeOpacity={0.7}
      disabled={disabled}
      {...props}>
      {title && (
        <Typography variant={textVariant} style={textStyle}>
          {title}
        </Typography>
      )}
      {children}
    </TouchableOpacity>
  );
};

export const Button = forwardRef(ButtonComponent);

const styles = StyleSheet.create({
  base: {
    height: 44,

    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
    pointerEvents: 'none',
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
  },

  secondary: {
    backgroundColor: colors.white,
    color: colors.primary,
  },
  danger: {
    backgroundColor: colors.white,
    color: colors.red,
  },
  ghost: {
    backgroundColor: 'transparent',
    padding: 0,
    height: 'auto',
  },
});

const variantTextStyles = StyleSheet.create({
  primary: {},
  secondary: {},
  danger: {
    color: colors.red,
    textAlign: 'center',
  },
  ghost: {
    color: colors.primary,
    fontFamily: 'Inter_500Medium',
    fontWeight: 500,
    fontSize: 14,
  },
});

import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { Typography, TypographyVariant } from './Typography';
import { theme } from '../styles/theme';
import { Colors, FontWeight } from '../styles/types';
import { LucideIcon } from 'lucide-react-native';

const textVariantStyle = {
  primary: {
    color: 'textPrimary',
    variant: 'text',
    weight: 'section',
  },
  secondary: {
    color: 'textSecondary',
    variant: 'text',
    weight: 'section',
  },
  ghost: {
    color: 'primary',
    variant: 'textSmall',
    weight: 'section',
  },
};

interface ButtonProps extends TouchableOpacityProps {
  variant?: keyof typeof variantStyles;
  title?: string;
  Icon?: LucideIcon;
}

export const Button = ({
  variant = 'primary',
  Icon,
  title,
  disabled,
  style,
  ...props
}: ButtonProps) => {
  const variantStyle = variantStyles[variant];
  const typographyStyle = textVariantStyle[variant];

  return (
    <TouchableOpacity
      {...props}
      style={[styles.base, variantStyle, style, disabled && styles.disabled]}
      activeOpacity={0.7}
      disabled={disabled}>
      {Icon && <Icon color={theme.colors.textPrimary} />}
      {title && (
        <Typography
          variant={typographyStyle.variant as TypographyVariant}
          color={typographyStyle.color as Colors}
          weight={typographyStyle.weight as FontWeight}>
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.6,
  },
  base: {
    minHeight: 48,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
});

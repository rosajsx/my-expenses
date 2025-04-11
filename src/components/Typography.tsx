import { Text, TextProps, TextStyle } from 'react-native';
import { theme } from '../styles/theme';
import { Colors, FontWeight } from '../styles/types';

export type TypographyVariant =
  | 'title'
  | 'subtitle'
  | 'section'
  | 'text'
  | 'textSmall'
  | 'label'
  | 'success'
  | 'error';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: Colors;
  weight?: FontWeight;
}

type Variants = {
  [key: string]: {
    fontSize: TextStyle['fontSize'];
    fontWeight: TextStyle['fontWeight'];
    lineHeight: TextStyle['lineHeight'];
    fontFamily: TextStyle['fontFamily'];
    color: TextStyle['color'];
  };
};

const variants: Variants = {
  title: {
    fontSize: theme.fonts.sizes.title,
    fontWeight: theme.fonts.weight.title as TextStyle['fontWeight'],
    lineHeight: theme.fonts.lineHeights.title,
    fontFamily: theme.fonts.family.bold,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.fonts.sizes.subtitle,
    fontWeight: theme.fonts.weight.subtitle as TextStyle['fontWeight'],
    lineHeight: theme.fonts.lineHeights.subtitle,
    fontFamily: theme.fonts.family.semi,
    color: theme.colors.textPrimary,
  },
  section: {
    fontSize: theme.fonts.sizes.section,
    fontWeight: theme.fonts.weight.section as TextStyle['fontWeight'],
    lineHeight: theme.fonts.lineHeights.section,
    fontFamily: theme.fonts.family.semi,
    color: theme.colors.textPrimary,
  },
  text: {
    fontSize: theme.fonts.sizes.text,
    fontWeight: theme.fonts.weight.text as TextStyle['fontWeight'],
    lineHeight: theme.fonts.lineHeights.text,
    fontFamily: theme.fonts.family.regular,
    color: theme.colors.textPrimary,
  },
  textSmall: {
    fontSize: theme.fonts.sizes.textSmall,
    fontWeight: theme.fonts.weight.textSmall as TextStyle['fontWeight'],
    lineHeight: theme.fonts.lineHeights.textSmall,
    fontFamily: theme.fonts.family.regular,
    color: theme.colors.textSecondary,
  },
  label: {
    fontSize: theme.fonts.sizes.label,
    fontWeight: theme.fonts.weight.label as TextStyle['fontWeight'],
    lineHeight: theme.fonts.lineHeights.label,
    fontFamily: theme.fonts.family.medium,
    color: theme.colors.textSecondary,
  },
  success: {
    fontSize: theme.fonts.sizes.success,
    fontWeight: theme.fonts.weight.success as TextStyle['fontWeight'],
    lineHeight: theme.fonts.lineHeights.success,
    fontFamily: theme.fonts.family.regular,
    color: theme.colors.success,
  },
  error: {
    fontSize: theme.fonts.sizes.error,
    fontWeight: theme.fonts.weight.error as TextStyle['fontWeight'],
    lineHeight: theme.fonts.lineHeights.error,
    fontFamily: theme.fonts.family.regular,
    color: theme.colors.error,
  },
};

export const Typography = ({
  variant = 'text',
  weight,
  color,
  style,
  ...rest
}: TypographyProps) => {
  const variantStyle = variants[variant];

  return (
    <Text
      {...rest}
      style={[
        variantStyle,
        style,
        color && { color: theme.colors[color] },
        weight && {
          fontWeight: theme.fonts.weight[weight] as TextStyle['fontWeight'],
        },
      ]}
    />
  );
};

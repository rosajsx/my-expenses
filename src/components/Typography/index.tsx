import { colors, IColors } from '@/styles/colors';
import { typographyTokens } from '@/styles/typography';
import { forwardRef } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

export type TypographyVariant = keyof typeof typographyTokens;

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: IColors;
  align?: TextStyle['textAlign'];
}

const TypographyComponent = (
  { variant = 'body/lg', align, color, style, ...rest }: TypographyProps,
  ref: any,
) => {
  const baseStyle = typographyTokens[variant] as TextStyle;
  const textColor = color ? { color: colors[color] } : {};

  return <Text style={[baseStyle, textColor, { textAlign: align }, style]} {...rest} />;
};

export const Typography = forwardRef(TypographyComponent);

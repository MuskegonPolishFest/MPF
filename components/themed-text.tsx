/*
Based on the typography definitions in the constants/theme.ts file.
 */
import { Text, type TextProps } from 'react-native';

import { Typography, type TypographyVariant } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

const typographyVariants: TypographyVariant[] = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'small', 'button',
];

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: TypographyVariant;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'body',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const typographyStyle = Typography[type];

  return (
    <Text
      style={[{ color }, typographyStyle, style]}
      {...rest}
    />
  );
}
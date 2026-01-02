import { MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
});

export const temaCustomizado = {
  ...MD3LightTheme,
  ...LightTheme,
  fonts: MD3LightTheme.fonts,
  version: 3, // Isso é crucial para o SDK 54 reconhecer as variantes novas
  colors: {
    ...MD3LightTheme.colors,
    primary: '#005AC1', // Azul clássico automotivo
    secondary: '#535F70',
    tertiary: '#6E5D77',
  },
};
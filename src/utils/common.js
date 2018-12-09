import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('screen');
export const deviceHeight = height;
export const deviceWidth = width;

export const fonts = {
  small: 14,
  medium: 18,
  large: 24,
};

export const colors = {
  black: '#000',
  white: '#fff',
  grey: '#d3d3d3',
  dark: '#23282d',
};
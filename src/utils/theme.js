/**
 * @providesModule theme
 */

import { moderateScale } from 'react-native-size-matters';

import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('screen');
const deviceHeight = height;
const deviceWidth = width;

const fonts = {
  small: moderateScale(14, 0.2),
  medium: moderateScale(18, 0.2),
  large: moderateScale(24, 0.2),
};

const colors = {
  primary: '#007dc0',
  secondary: '#8cd5df',
  black: '#000',
  white: '#fff',
  grey: '#d3d3d3',
  dark: '#23282d',
  darkGray: '#4a4a4a',
  lightGray: '#e3e3e3',
  mediumGray: '#c9c9c9',
  grayIcon: '#828f9b',
  mask: 'rgba(52, 52, 52, 0.8)',
  red: '#c0001d',
};

const elevation = {
  elevation: 2,
  shadowOpacity: 0.5,
  shadowRadius: 2,
  shadowColor: colors.dark,
  shadowOffset: { height: 1, width: 0 },
};

export {
  colors,
  deviceHeight,
  deviceWidth,
  elevation,
  fonts,
};

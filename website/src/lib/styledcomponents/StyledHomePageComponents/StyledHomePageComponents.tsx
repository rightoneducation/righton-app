import React from 'react';
import { Box, Grid, styled, Typography } from '@mui/material';

interface StyledBoxProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  gap?: number;
  borderRadius?: number;
  align?:
    | 'normal'
    | 'stretch'
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'self-start'
    | 'self-end'
    | 'baseline'
    | 'first baseline'
    | 'last baseline'
    | 'safe center'
    | 'unsafe center';
  justify?:
    | 'normal'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'left'
    | 'right'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch'
    | 'safe center'
    | 'unsafe center';
}

export const StyledFlexBox = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'direction' &&
    prop !== 'gap' &&
    prop !== 'borderRadius' &&
    prop !== 'justify' &&
    prop !== 'align',
})<StyledBoxProps>(
  ({ theme, direction, gap, borderRadius, justify, align }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: direction ?? 'column',
    gap: gap ? `${gap}px` : 0,
    borderRadius: borderRadius ? `${borderRadius}px` : 0,
    alignItems: align ?? 'normal',
    justifyContent: justify ?? 'normal',
    boxSizing: 'border-box',
    zIndex: 5,
  }),
);

export const StyledText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  color: '#fff',
}));

export const EmphasizeText = styled('span')(({ theme }) => ({
  color: '#FF3A6A',
  fontSize: '20px',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
}));

export const StyledHeaderText = styled(Typography)(({ theme }) => ({
  fontSize: '60px',
  fontFamily: 'Poppins',
  color: 'white',
  fontWeight: 500,
  lineHeight: '100%',
  letterSpacing: '-4%',
}));

export const StyledSubText = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontFamily: 'Poppins',
  color: 'white',
  fontWeight: 400,
  lineHeight: 'auto',
  WebkitFontSmoothing: 'antialiased', // improves rendering on WebKit
  MozOsxFontSmoothing: 'grayscale',   // improves rendering on Firefox
  textRendering: 'optimizeLegibility', // smoother curves
}));

export const HomePageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100dvh',
  boxSizing: 'border-box',
  background: 'transparent',
}));

export const OpeningTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '32px',
}));

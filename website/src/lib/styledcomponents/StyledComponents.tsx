import React from 'react';
import { Box, styled } from '@mui/material';
import mathSymbolsBackground from '../../images/mathSymbolsBackground.svg';

export const AppContainer = styled(Box)(({ theme }) => ({ // eslint-disable-line
  display: 'flex',
  width: '100%', 
  height: '100%',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  boxSizing: 'border-box',
  overflow: 'hidden',
}));

export const MathSymbolsBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  width:'100%',
  height: '100vh',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 1,
  zIndex: -1,
  backgroundColor: "#f6f6f6",
  backgroundImage: `
  linear-gradient(rgba(2, 33, 95, 0.90), rgba(2, 33, 95, 0.9)),
  url(${mathSymbolsBackground})
  `,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
}));

export enum ScreenSize {
  LARGE,
  MEDIUM,
  SMALL,
}


export const SelectArrowContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelectOpen',
})<{ isSelectOpen: boolean }>(({ isSelectOpen }) => ({
  transform: isSelectOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  animation: isSelectOpen
    ? 'rotateScaleOpen 300ms ease-in-out'
    : 'rotateScaleClose 300ms ease-in-out',
  '@keyframes rotateScaleOpen': {
    '0%': {
      transform: 'rotate(0deg) scale(1)',
    },
    '50%': {
      transform: 'rotate(180deg) scale(1.1)',
    },
    '100%': {
      transform: 'rotate(180deg) scale(1)',
    },
  },
  '@keyframes rotateScaleClose': {
    '0%': {
      transform: 'rotate(180deg) scale(1)',
    },
    '50%': {
      transform: 'rotate(0deg) scale(1.1)',
    },
    '100%': {
      transform: 'rotate(0deg) scale(1)',
    },
  },
}));

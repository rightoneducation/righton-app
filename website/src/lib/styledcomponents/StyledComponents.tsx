import React from 'react';
import { Box, styled } from '@mui/material';
import mathSymbolsBackground from '../../images/mathSymbolsBackground.svg';

export const AppContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'menuOpen',
})<{ menuOpen?: boolean }>(({ menuOpen }) => ({
  display: 'flex',
  width: '100%',
  minHeight: '100dvh',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxSizing: 'border-box',
  overflow: 'hidden',
  height: menuOpen ? '100vh' : 'auto',
}));

export const MathSymbolsBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 1,
  zIndex: -1,
  backgroundColor: '#0F235E',
  backgroundImage: `
  linear-gradient(rgba(2, 33, 95, 0), rgba(20, 43, 111, 0.9)),
  url(${mathSymbolsBackground})
  `,
  backgroundSize: 'auto',
  backgroundRepeat: 'repeat-y',
  backgroundPosition: 'center top',
}));

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 'clamp(12px, 1.5vw, 24px)',
}));

export const StyledButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected: boolean }>(({ selected }) => ({
  padding: '4px 12px',
  color: selected ? '#FF3A6A' : '#FFFFFF',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '20px',
  lineHeight: '20px',
  fontWeight: 400,
  cursor: 'pointer',
  transition: 'border 0.3s ease',
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

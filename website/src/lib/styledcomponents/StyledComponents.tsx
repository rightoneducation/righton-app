import React from 'react';
import { Box, styled } from '@mui/material';
import mathSymbolsBackground from '../../images/mathSymbolsBackground.svg';

export const AppContainer = styled(Box)(({ theme }) => ({ // eslint-disable-line
  display: 'flex',
  width: '100%', 
  minHeight: '100dvh',
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

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  gap: 'clamp(12px, 1.5vw, 24px)',
}));

export const StyledButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected: boolean }>(({ selected }) => ({
  padding: 'clamp(8px, 1vw, 12px) clamp(16px, 2vw, 24px)',
  color: selected ? '#FF3A6A' : '#FFFFFF',
  fontFamily: 'Poppins, sans-serif',
  fontSize: 'clamp(14px, 1.2vw, 20px)',
  fontWeight: 400,
  cursor: 'pointer',
  transition: 'border 0.3s ease',
}));

export enum ScreenSize {
  LARGE,
  MEDIUM,
  SMALL,
}


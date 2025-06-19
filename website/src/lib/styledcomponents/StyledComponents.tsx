import React from 'react';
import { Box, styled } from '@mui/material';
import mathSymbolsBackground from '../../images/mathSymbolsBackground.svg';

export const AppContainer = styled(Box)(({ theme }) => ({ // eslint-disable-line
  display: 'flex',
  width: '100%',
  height: '100vh',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
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

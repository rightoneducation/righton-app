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

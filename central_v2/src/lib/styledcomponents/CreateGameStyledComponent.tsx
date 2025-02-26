import React from 'react';
import { Box, Grid, TextField, Paper, Button, styled } from '@mui/material';
import mathSymbolsBackground from '../../images/mathSymbolsBackground.svg';

export const CreateGameMainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
  boxSizing: 'border-box',
}));

export const CreateGameBackground = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  opacity: 0.1,
  position: 'absolute',
  zIndex: 0,
  backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
  backgroundImage: `
    linear-gradient(180deg, rgb(254, 251, 247) 0%, rgba(254, 251, 247, 0) 100%),
    url(${mathSymbolsBackground})
  `,
}));
import React from 'react';
import { Box, styled } from '@mui/material';

export const SignUpMainContainer = styled(Box)(({ theme }) => ({ // eslint-disable-line
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
  // justifyContent: 'center',
  overflow: 'auto',
  flexGrow: 1,
  boxSizing: 'border-box'
  // border: '5px solid green'
}));

import React from 'react';
import { Box, styled } from '@mui/material';

export const SignUpMainContainer = styled(Box)(({ theme }) => ({ // eslint-disable-line
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
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
  boxSizing: 'border-box',
  gap: `${theme.sizing.xLgPadding}px`
  // border: '1px solid red'
}));

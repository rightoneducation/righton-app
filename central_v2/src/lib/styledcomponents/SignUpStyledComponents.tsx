import React from 'react';
import { Box, styled } from '@mui/material';

export const SignUpMainContainer = styled(Box)(({ theme }) => ({ // eslint-disable-line
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: `${theme.palette.primary.lightBlueBackgroundColor}`,
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
  // justifyContent: 'center',
  overflow: 'auto',
  flexGrow: 1,
  paddingTop: '40px',
  paddingBottom: '124px'

}));

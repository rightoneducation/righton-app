import React from 'react';
import { Box, styled } from '@mui/material';
import { ScreenSize } from '../CentralModels';

export const ExploreGamesMainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
}));

interface ExploreGamesUpperContainerProps {
  screenSize: ScreenSize;
}

export const ExploreGamesUpperContainer = styled(
  Box,
)<ExploreGamesUpperContainerProps>(({ screenSize, theme }) => ({
  // eslint-disable-line
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: `${theme.palette.primary.lightBlueBackgroundColor}`,
  position: 'relative'
}));

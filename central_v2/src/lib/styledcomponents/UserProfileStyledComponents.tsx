import React from 'react';
import { styled, Grid } from '@mui/material';
import { ScreenSize } from '../CentralModels';

export const UserProfileMainContainer = styled(Grid)(({ theme }) => ({
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
  paddingTop: '40px',
  gap: '40px',
  overflow: 'auto',
  flexGrow: 1,
  boxSizing: 'border-box',
  // border: '1px solid red'
}));

export const UserProfileGridContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  gap: `${theme.sizing.smPadding}px`,
}));

type UserProfileGridItemProps = { screenSize: ScreenSize };

export const UserProfileGridItem = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<UserProfileGridItemProps>(({ theme, screenSize }) => ({
  width: '100%',
  maxWidth: '672px',
  minWidth: screenSize !== ScreenSize.SMALL ? '672px' : '0px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: `${theme.sizing.smPadding}px`,
}));
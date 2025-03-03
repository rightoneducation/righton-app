import React from 'react';
import { Box, Tab, styled } from '@mui/material';
import mathSymbolsBackground from '../../images/mathSymbolsBackground.svg';

export const MyLibraryMainContainer = styled(Box)(({ theme }) => ({
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
  display: 'flex'
}));

export const MyLibraryBackground = styled(Box)(({ theme }) => ({
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

type LibraryTabProps = {
  isSelected: boolean;
};

export const LibraryTab = styled(Tab)<LibraryTabProps>(({ theme, isSelected }) => ({
  background: theme.palette.primary.darkBlue,
  color: theme.palette.primary.main,
  minWidth: '64px',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  '&.Mui-selected': {
    background: '#02215F',
    color: theme.palette.primary.main,
  },
  pointerEvents: 'auto',
  cursor: 'pointer',
}));

export const LibraryTabsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '100%',
  width: '100dvw',
  flexGrow: 1,
  zIndex: 7,
  overflow: 'hidden',
  pointerEvents: 'none',
}));
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
  msOverflowStyle: 'none',
  boxSizing: 'border-box',
  position: 'relative'
}));

export const MyLibraryBackground = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  opacity: 0.1,
  position: 'relative',
  zIndex: 0,
  overflow: 'hidden',
  backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
  backgroundImage: `
    linear-gradient(180deg, rgb(254, 251, 247) 0%, rgba(254, 251, 247, 0) 100%),
    url(${mathSymbolsBackground})
  `,
}));

type LibraryTabProps = {
  isSelected: boolean;
};

export const LibraryTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<LibraryTabProps>(({ theme, isSelected }) => ({
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

export const LibraryTabsStyledContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100dvw',
  left: 0, 
  top: 0,
  position: 'absolute',
  flexGrow: 1,
  zIndex: 7,
  overflow: 'hidden',
  pointerEvents: 'none',
}));

export const ContentFrame = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  paddingTop: '32px',
  paddingLeft: '32px',
  paddingRight: '32px',
  boxSizing: 'border-box',
}));
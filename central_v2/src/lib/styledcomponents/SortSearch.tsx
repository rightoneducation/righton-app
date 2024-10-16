import React from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
import { SortType, SortDirection } from '@righton/networking';
import { ScreenSize } from '../CentralModels';


export const SortContainer = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'relative',
  };
});

export const SortButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize }>(({ screenSize }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minWidth: '44px',
    minHeight: '44px',
    background: 'linear-gradient(90deg, #F60E44 0%, #E31C5E 100%)',
    borderRadius: '22px',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '12px',
    paddingRight: '12px',
    boxSizing: 'border-box',
    gap: '8px',
    zIndex: 4,
    cursor: 'pointer'
}));

export const SortLabel = styled(Typography)(() => {
  return {
    color: 'white',
    fontFamily: 'Poppins',
    fontSize: '20',
    fontWeight: '700'
  };
});

export const SortArrowContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSortOpen',
})<{ isSortOpen: boolean }>(({ isSortOpen }) => ({
  transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  animation: isSortOpen ? 'rotateScaleOpen 300ms ease-in-out' : 'rotateScaleClose 300ms ease-in-out',
  '@keyframes rotateScaleOpen': {
    '0%': {
      transform:'rotate(0deg) scale(1)'
    },
    '50%': {
      transform: 'rotate(180deg) scale(1.1)'
    },
    '100%': {
      transform: 'rotate(180deg) scale(1)'
    }
  },
  '@keyframes rotateScaleClose': {
    '0%': {
      transform:'rotate(180deg) scale(1)'
    },
    '50%': {
      transform: 'rotate(0deg) scale(1.1)'
    },
    '100%': {
      transform: 'rotate(0deg) scale(1)'
    }
  }
}));

export const SortMenuArrowContainer = styled(SortArrowContainer, {
  shouldForwardProp: (prop) => prop !== 'selectedSort' && prop !== 'currentSort',
})<{ selectedSort: {field: SortType, direction: SortDirection}, currentSort: SortType}>(({ selectedSort, currentSort}) => ({
  transform: selectedSort.field === currentSort && selectedSort.direction === SortDirection.ASC ? 'rotate(180deg)' : 'rotate(0deg)',
  animation: selectedSort.field === currentSort && selectedSort.direction === SortDirection.ASC ? 'rotateScaleOpen 300ms ease-in-out' : 'rotateScaleClose 300ms ease-in-out',
}));

export const SortMenu = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSortOpen',
})<{ isSortOpen: boolean }>(({ isSortOpen }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  zIndex: 3,
  background: 'white',
  borderRadius: '16px',
  padding: "8px",  
  position: 'absolute',     
  top: '44px',             
  right: 0,
  width: '100%',
  minWidth: '174px',
  boxSizing: 'border-box',
  transition: isSortOpen ? 'opacity 300ms ease, transform 300ms ease-in-out' : 'opacity 300ms ease, transform 150ms ease-in-out',
  opacity: isSortOpen ? 1 : 0,
  transform: isSortOpen ? 'translateY(0px)' : 'translateY(-20px)',
  boxShadow: '0px 8px 16px -4px rgba(0, 0, 0, 0.4)',
  cursor: isSortOpen ? 'pointer' : 'default'
}));

export const SortMenuItem = styled(Box)(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '16px',
  };
});

export const SelectButtonBox = styled(Box)(({theme}) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const SelectButton = styled(Button)(({theme}) => ({
  width: '155px',
  height: '38px',
  padding: `${theme.sizing.xxSmPadding}px 12px`,
  gap: `${theme.sizing.xSmPadding}px`,
  borderRadius: '54px',
  background: 'linear-gradient(270.1deg, #1C94C3 0.09%, #2A6AC6 64.33%, #2C62C6 76.27%, #3153C7 99.91%)',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
  color: '#FFFFFF',
  textTransform: 'none',
}));
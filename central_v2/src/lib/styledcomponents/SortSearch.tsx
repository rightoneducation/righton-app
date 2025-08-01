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
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minWidth: '44px',
  minHeight: '44px',
  background: `${theme.palette.primary.buttonActionDefault}`,
  borderRadius: `${theme.sizing.xSmPadding}px`,
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '12px',
  paddingRight: '12px',
  boxSizing: 'border-box',
  gap: '8px',
  zIndex: 4,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: `${theme.palette.primary.buttonActionHover}`,
  },
  '&:disabled': {
    backgroundColor: `${theme.palette.primary.buttonActionDisable}`,
  },
}));

export const SortLabel = styled(Typography)(() => {
  return {
    color: 'white',
    fontFamily: 'Poppins',
    fontSize: '20px',
    fontWeight: '700',
  };
});

export const SortArrowContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSortOpen',
})<{ isSortOpen: boolean }>(({ isSortOpen }) => ({
  transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  animation: isSortOpen
    ? 'rotateScaleOpen 300ms ease-in-out'
    : 'rotateScaleClose 300ms ease-in-out',
  '@keyframes rotateScaleOpen': {
    '0%': {
      transform: 'rotate(0deg) scale(1)',
    },
    '50%': {
      transform: 'rotate(180deg) scale(1.1)',
    },
    '100%': {
      transform: 'rotate(180deg) scale(1)',
    },
  },
  '@keyframes rotateScaleClose': {
    '0%': {
      transform: 'rotate(180deg) scale(1)',
    },
    '50%': {
      transform: 'rotate(0deg) scale(1.1)',
    },
    '100%': {
      transform: 'rotate(0deg) scale(1)',
    },
  },
}));

export const SortMenuArrowContainer = styled(SortArrowContainer, {
  shouldForwardProp: (prop) =>
    prop !== 'selectedSort' && prop !== 'currentSort',
})<{
  selectedSort: { field: SortType | null; direction: SortDirection };
  currentSort: SortType;
}>(({ selectedSort, currentSort }) => ({
  transform:
    selectedSort.field === currentSort &&
    selectedSort.direction === SortDirection.ASC
      ? 'rotate(180deg)'
      : 'rotate(0deg)',
  animation:
    selectedSort.field === currentSort &&
    selectedSort.direction === SortDirection.ASC
      ? 'rotateScaleOpen 300ms ease-in-out'
      : 'rotateScaleClose 300ms ease-in-out',
}));

export const SortMenu = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSortOpen',
})<{ isSortOpen: boolean }>(({ isSortOpen }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  zIndex: 1300,
  background: 'white',
  borderRadius: '8px',
  padding: '20px',
  position: 'absolute',
  top: '44px',
  right: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: isSortOpen
    ? 'opacity 300ms ease, transform 300ms ease-in-out'
    : 'opacity 300ms ease, transform 150ms ease-in-out',
  opacity: isSortOpen ? 1 : 0,
  transform: isSortOpen ? 'translateY(0px)' : 'translateY(-20px)',
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.15)',
  cursor: isSortOpen ? 'pointer' : 'default',
}));

interface SortMenuItemProps {
  isSelected: boolean;
}

export const SortMenuItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<SortMenuItemProps>(({ isSelected, theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '8px',
  paddingLeft: '4px',
  paddingRight: '4px',
  background: isSelected
    ? `${theme.palette.primary.sortActive}`
    : 'transparent',
  '&:hover': {
    background: isSelected
      ? `${theme.palette.primary.sortActive}`
      : `${theme.palette.primary.sortHover}`,
  },
}));

export const SelectButtonBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const SelectButton = styled(Button)(({ theme }) => ({
  width: '155px',
  height: '38px',
  padding: `${theme.sizing.xxSmPadding}px 12px`,
  gap: `${theme.sizing.xSmPadding}px`,
  borderRadius: '54px',
  background:
    'linear-gradient(270.1deg, #1C94C3 0.09%, #2A6AC6 64.33%, #2C62C6 76.27%, #3153C7 99.91%)',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
  color: '#FFFFFF',
  textTransform: 'none',
}));

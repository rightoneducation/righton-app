import React, { useState, ChangeEvent } from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
import { ScreenSize } from '../CentralModels';

export const SelectContainer = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'relative',
  };
});

export const SelectGrade = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: screenSize === ScreenSize.SMALL ? '38px' : '240px',
  minHeight: '44px',
  background: `${theme.palette.primary.buttonActionDefault}`,
  borderTopLeftRadius: `${theme.sizing.xSmPadding}px`,
  borderBottomLeftRadius: `${theme.sizing.xSmPadding}px`,
  gap: '16px',
  zIndex: 4,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: `${theme.palette.primary.buttonActionHover}`,
  },
  '&:disabled': {
    backgroundColor: `${theme.palette.primary.buttonActionDisable}`,
  },
}));

export const SelectLabel = styled(Typography)(() => {
  return {
    color: 'white',
    fontFamily: 'Poppins',
    fontSize: '20px',
    fontWeight: '700',
  };
});

export const SelectArrowContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelectOpen',
})<{ isSelectOpen: boolean }>(({ isSelectOpen }) => ({
  transform: isSelectOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  animation: isSelectOpen
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

export const SelectMenu = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelectOpen' && prop !== 'screenSize',
})<{ isSelectOpen: boolean, screenSize: ScreenSize }>(({ theme, isSelectOpen, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  zIndex: 3,
  background: 'white',
  gap: `${theme.sizing.xxSmPadding}px`,
  borderTopLeftRadius: `${theme.sizing.xSmPadding}px`,
  borderTopRightRadius: screenSize === ScreenSize.LARGE ? 0: `${theme.sizing.xSmPadding}px`,
  borderBottomLeftRadius: `${theme.sizing.xSmPadding}px`,
  borderBottomRightRadius: `${theme.sizing.xSmPadding}px`,
  paddingLeft: '36px',
  paddingRight: '36px',
  paddingTop: `${theme.sizing.xSmPadding}px`,
  paddingBottom: `${theme.sizing.xSmPadding}px`,
  position: 'absolute',
  top: '44px',
  left: 0,
  width: screenSize === ScreenSize.LARGE ? '100%' : `calc(100vw - 16px - 44px - ${theme.sizing.lgPadding}px - ${theme.sizing.lgPadding}px)`,
  minWidth: '240px',
  boxSizing: 'border-box',
  transition: isSelectOpen
    ? 'opacity 300ms ease, transform 300ms ease-in-out'
    : 'opacity 300ms ease, transform 150ms ease-in-out',
  opacity: isSelectOpen ? 1 : 0,
  transform: isSelectOpen ? 'translateY(0px)' : 'translateY(-20px)',
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.15)',
}));

export const SelectMenuItem = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: `${theme.sizing.xSmPadding}px`,
  paddingTop: `${theme.sizing.xSmPadding}px`,
  paddingBottom: `${theme.sizing.xSmPadding}px`,
  paddingLeft: `${theme.sizing.xSmPadding}px`,
  borderSizing: 'border-box',
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

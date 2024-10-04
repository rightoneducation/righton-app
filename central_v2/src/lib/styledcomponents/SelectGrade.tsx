import React, { useState, ChangeEvent } from 'react';
import { Box, Slide, styled, Typography } from '@mui/material';


export const SelectContainer = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'relative',
  };
});

export const SelectGrade = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '240px',
    minHeight: '44px',
    background: 'linear-gradient(90deg, #F60E44 0%, #E31C5E 100%)',
    borderTopLeftRadius: '22px',
    borderBottomLeftRadius: '22px',
    gap: '16px',
    zIndex: 3
  };
});

export const SelectLabel = styled(Typography)(() => {
  return {
    color: 'white',
    fontFamily: 'Poppins',
    fontSize: '20',
    fontWeight: '700'
  };
});

export const SelectArrowContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelectOpen',
})<{ isSelectOpen: boolean }>(({ isSelectOpen }) => ({
  transform: isSelectOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  animation: isSelectOpen ? 'rotateScaleOpen 300ms ease-in-out' : 'rotateScaleClose 300ms ease-in-out',
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

export const SelectMenu = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelectOpen',
})<{ isSelectOpen: boolean }>(({ isSelectOpen }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  zIndex: 2,
  background: 'white',
  borderTopLeftRadius: '16px',
  borderBottomLeftRadius: '16px',
  borderBottomRightRadius: '16px',
  paddingLeft: '36px',
  position: 'absolute',     
  top: '44px',             
  left: 0,
  width: '100%',
  boxSizing: 'border-box',
  transition: isSelectOpen ? 'opacity 300ms ease, transform 300ms ease-in-out' : 'opacity 300ms ease, transform 150ms ease-in-out',
  opacity: isSelectOpen ? 1 : 0,
  transform: isSelectOpen ? 'translateY(0px)' : 'translateY(-20px)',
}));

export const SelectMenuItem = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  };
});
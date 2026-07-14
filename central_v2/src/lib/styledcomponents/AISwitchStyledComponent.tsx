import React from 'react';
import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AISwitch = styled(Switch)(({ theme }) => ({ // eslint-disable-line
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: '#CCCCCC',
    opacity: 1,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      left: 12,
    },
    '&::after': {
      right: 12,
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFFFFF',
  },
  '& .MuiSwitch-thumb': {
    background: theme.palette.primary.aiGradient,
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#CCCCCC',
  },
}));

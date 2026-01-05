import React from 'react';
import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';

const aiGradient = 
  'linear-gradient(90deg, #4700B2 0%, #5A257D 100%)';

const darkPurple = '#4700B2';

export const AISwitch = styled(Switch)(({ theme }) => ({ // eslint-disable-line
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: '#D8DFE9',
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
    color: aiGradient,
  },
  '& .MuiSwitch-thumb': {
    background: aiGradient,
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
  '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
    background: '#D8DFE9',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    background: aiGradient,
    opacity: 1,
  },
}));

import React from 'react';
import { Tooltip, styled } from '@mui/material';

export const CustomTooltip = styled(Tooltip)({ // eslint-disable-line
  '& .MuiTooltip-tooltip': {
    backgroundColor: '#02215F !important', // Ensures the background applies
    color: '#FFFFFF !important', // Ensures text remains white
    fontSize: '14px',
    padding: '10px 15px',
    borderRadius: '8px',
    maxWidth: '250px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
  },
  '& .MuiTooltip-arrow': {
    color: '#02215F !important', // Ensures arrow color matches the tooltip
  },
});

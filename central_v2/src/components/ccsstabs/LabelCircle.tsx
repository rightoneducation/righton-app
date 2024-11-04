import React from 'react';
import { Box, Typography } from '@mui/material';

interface LabelCircleProps {
  selectedValue: string;
  isSelected: boolean;
}

export default function LabelCircle({selectedValue, isSelected}: LabelCircleProps) {
  return (
    <Box
      style={{
        height: '35px',
        minWidth: '35px',
        boxSizing: 'border-box',
        borderRadius: '50%',
        backgroundColor: '#FFF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isSelected ? 1 : 0.5,
      }}
    >
      <Typography style={{
        fontSize: selectedValue.length < 3 ? '20px' : '15px',
        color: '#4700B2',
        fontWeight: 'bold',
      }}>
        {selectedValue}
      </Typography>  
    </Box>
  );
}

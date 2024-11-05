import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

interface LabelCircleProps {
  selectedValue: string;
  isSelected: boolean;
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LabelCircle({selectedValue, isSelected, handleOnChange}: LabelCircleProps) {
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
      <TextField value={selectedValue} onChange={handleOnChange} size="small" style={{
        fontSize: selectedValue.length < 3 ? '20px' : '15px',
        color: '#4700B2',
        fontWeight: 700,
        width: '35px',
        textAlign: 'center'
      }} 
      sx={{
        '& .MuiInputBase-root': {
          padding: 0,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'inherit',
          color: 'inherit',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          border: 'none',
          textAlign: 'center',
        },
        '& .MuiInput-underline:before, & .MuiInput-underline:after': {
          borderBottom: 'none',
        },
        '& .MuiInputLabel-root': {
          display: 'none',
        },
        '& .MuiInputBase-input': {
          padding: 0,
          margin: 0,
          textAlign: 'center',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          fontWeight: 700, // Apply fontWeight directly to the input
          fontSize: selectedValue.length < 3 ? '20px' : '15px',
          color: '#4700B2',
        },
        '& .MuiOutlinedInput-root': {
          padding: 0,
          margin: 0,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiInputBase-root:hover, & .MuiInputBase-root:focus': {
          outline: 'none',
          border: 'none',
        },
      }}
      InputProps={{
        disableUnderline: true,
      }}
      />
    </Box>
  );
}

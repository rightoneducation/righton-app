import React, { useState } from 'react';
import { Radio, FormControlLabel, RadioGroup, Box } from '@mui/material';

interface RadioButtonGroupProps {
  radioValue: number;
  setRadioValue: (value: number) => void;
}

export default function RadioButtonGroup ({radioValue, setRadioValue}:RadioButtonGroupProps) {
  
  const handleChange = () => {
    setRadioValue(radioValue === 0 ? 1 : 0);
  };

  return (
    <Box 
      sx={{
        position: 'absolute',
        top: '0',
        left: '0'
      }}
    >
      <RadioGroup
        aria-label="position"
        name="position"
        value={radioValue}
        onChange={handleChange}
        row
      >
        <FormControlLabel
          value={0}
          control={<Radio color="primary" />}
          label=''
        />
        <FormControlLabel
          value={1}
          control={<Radio color="primary" />}
          label=''
        />
      </RadioGroup>
    </Box>
  );
}


import React from 'react';
import { Box, Typography } from '@mui/material';

export function Footer() { // eslint-disable-line
  return (
    <Box style={{
      background: '#CCC', 
      width: '100%', // Use 100% to work with the AppContainer
      height: '100px',
      boxSizing: 'border-box',
      // overflow: 'hidden', // Prevent overflow
    }}>
      <Typography>Placeholder</Typography>
    </Box>
  )
}  
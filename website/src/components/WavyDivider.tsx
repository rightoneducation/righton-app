import React from 'react';
import Box from '@mui/material/Box';

export default function WavyDivider () {
  return (
    <Box
    component="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
    sx={{
      display: 'block',
      width: '100%',
      height: '80px',
      transform: 'translateY(1px)', // prevent gap
      backgroundColor: 'transparent',
    }}
  >
    <path
      fill="#001642" // should match the background of the section below
      d="M0,0 C480,120 960,0 1440,100 L1440,0 L0,0 Z"
    />
  </Box>
  )
}
import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';

export function Header() { // eslint-disable-line
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  return (
    <Box style={{background: '#CCC', width: '100%', height: isSmallScreen ? '84px' : '184px'}}>
      <Typography>Placeholder</Typography>
    </Box>
  )
}  
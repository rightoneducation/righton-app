import React from 'react';
import { Box, Typography } from '@mui/material';
import { ScreenSize } from '../lib/WebsiteModels';



export function Footer({ screenSize }: { screenSize: ScreenSize}) { // eslint-disable-line
  const isMedium = screenSize === ScreenSize.MEDIUM;
  return (
    <Box sx={{
      background: '#CCC', 
      width: '100%', 
      minHeight: { md: '264px', sm: '744px', xs: '526px'}
      }}>
      <Typography>Placeholder</Typography>
    </Box>
  )
}  
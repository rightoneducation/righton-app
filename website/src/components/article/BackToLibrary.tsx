import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, useTheme } from '@mui/material';
import { ScreenSize } from '../../lib/WebsiteModels';
import BackLibrary from '../../images/backLibrary.svg';

interface BackToLibraryInterface {
  screenSize: ScreenSize;
}

export function BackToLibrary({ // eslint-disable-line
  screenSize
} : BackToLibraryInterface) {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Box 
      onClick={() => navigate('/library')}
      style={{ 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        gap: `${theme.sizing.smPadding}px`, 
        paddingTop: `${theme.sizing.mdPadding}px`, 
        paddingBottom: `${theme.sizing.mdPadding}px`, 
        paddingLeft: screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : `${theme.sizing.xLgPadding}px`, 
        boxSizing: 'border-box',
        cursor: 'pointer', 
      }}
    >
      <img src={BackLibrary} alt="Back Library" style={{ width: '22px', height: '22px' }}/>
      <Typography sx={{ fontSize: '16px', fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', textDecoration: 'underline' }}>
        Educator Resource Library
      </Typography>
    </Box>
  );
}

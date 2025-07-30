import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ScreenSize } from '../../lib/WebsiteModels';
import BackLibrary from '../../images/backLibrary.svg';

interface BackToLibraryInterface {
  screenSize: ScreenSize;
}

export function BackToLibrary({ // eslint-disable-line
  screenSize
} : BackToLibraryInterface) {
  const navigate = useNavigate();
  return (
    <Box 
      onClick={() => navigate('/library')}
      style={{ 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        paddingTop: '24px', 
        paddingBottom: '24px', 
        paddingLeft: screenSize === ScreenSize.SMALL ? '24px' : '72px', 
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

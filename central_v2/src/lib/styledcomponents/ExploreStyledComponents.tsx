import React from 'react';
import { Box, useTheme } from '@mui/material';
import { ScreenSize } from '../CentralModels';

interface MostPopularContainerProps {
  screenSize: ScreenSize;
  children: React.ReactNode;
}

export function MostPopularContainer({ screenSize, children }: MostPopularContainerProps) { // eslint-disable-line
  const theme = useTheme();

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#E9F1FF',
        padding: screenSize === ScreenSize.SMALL ? `${theme.sizing.smPadding}px ${theme.sizing.mdPadding}px` : `${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px ${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px`,
        boxSizing: 'border-box',
        gap: screenSize === ScreenSize.SMALL ? `${theme.sizing.smPadding}px` : `${theme.sizing.mdPadding}px`,
      }}
    >
      {children}
    </Box>
  );
}
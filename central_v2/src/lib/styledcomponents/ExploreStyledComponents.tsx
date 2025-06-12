import React from 'react';
import { Box, useTheme } from '@mui/material';
import { ScreenSize } from '../CentralModels';

interface MostPopularContainerProps {
  screenSize: ScreenSize;
  isMyLibrary?: boolean;
  children: React.ReactNode;
}

export function MostPopularContainer({ // eslint-disable-line
  screenSize,
  isMyLibrary,
  children,
}: MostPopularContainerProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        justifyContent: 'flex-start',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: isMyLibrary
          ? `none`
          : `${theme.palette.primary.creamBackgroundColor}`,
        padding:
          screenSize === ScreenSize.SMALL
            ? `${theme.sizing.smPadding}px ${theme.sizing.mdPadding}px`
            : `${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px ${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px`,
        paddingBottom: '128px',
        boxSizing: 'border-box',
        gap:
          screenSize === ScreenSize.SMALL
            ? `${theme.sizing.smPadding}px`
            : `${theme.sizing.mdPadding}px`,
        flexGrow: 1,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          // Chrome and Safari
          display: 'none',
        },
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none',
      }}
    >
      {children}
    </Box>
  );
}

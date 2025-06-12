import React from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { LoadingContainer } from '../lib/styledcomponents/LoadingStyledComponents';

export default function Loading() {
  const theme = useTheme();
  return (
    <LoadingContainer>
      <Box
        style={{
          paddingTop: `${theme.sizing.xLgPadding}px`,
          transform: 'translateX(-50%)',
        }}
      >
        <CircularProgress
          style={{ color: theme.palette.primary.darkBlueCardColor }}
        />
      </Box>
    </LoadingContainer>
  );
}

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LaunchContainerStyled from '../lib/styledcomponents/launchcontainer/LaunchContainerStyled';
import LoadingIndicator from '../components/LoadingIndicator';

export default function LaunchContainer() {
  const theme = useTheme();

  return (
      <LaunchContainerStyled>
        <Typography 
          variant="h2" 
          sx={{
            position: 'absolute',
            textAlign: 'center',
            zIndex: 2
          }}
        > 
          Launching Game...
        </Typography>
        <Box sx={{display: 'block'}}>
          <LoadingIndicator
            theme={theme.palette.primary.radialTimerArray}
            radius={110}
            timerStartInSecond={100}
            gameCreate
          />
        </Box>
      </LaunchContainerStyled>
  );
}
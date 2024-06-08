import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IAPIClients, GameSessionState } from '@righton/networking';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LaunchContainerStyled from '../lib/styledcomponents/launchcontainer/LaunchContainerStyled';
import LoadingIndicator from '../components/LoadingIndicator';
import useLaunchGame from '../hooks/useLaunchGame';

interface LaunchContainerProps {
  apiClients: IAPIClients;
  gameId: string;
}

export default function LaunchContainer({gameId, apiClients}:LaunchContainerProps) {
  const theme = useTheme();
  if (!gameId)
    throw new Error('Game ID is missing');
  const launch = useLaunchGame({apiClients, gameId}); // eslint-disable-line
  return (
    <LaunchContainerStyled>
      <Typography 
        variant="h2" 
        sx={{
          position: 'absolute',
          textAlign: 'center'
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
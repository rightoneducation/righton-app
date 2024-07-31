import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { APIClients, GameSessionState } from '@righton/networking';
import LaunchContainerStyled from '../lib/styledcomponents/launchcontainer/LaunchContainerStyled';
import LoadingIndicator from '../components/LoadingIndicator';

interface LaunchContainerProps {
  apiClients: APIClients;
  gameId: string;
}

export default function LaunchContainer({apiClients, gameId}: LaunchContainerProps) {
  const theme = useTheme();

  useEffect(() => {
    apiClients.gameSession.createGameSessionFromTemplate(gameId).then((response) => {
      if (!response) {
        return;
      }
      apiClients.gameSession
        .updateGameSession({
          id: response,
          currentState: GameSessionState.TEAMS_JOINING,
        })
        .then((updatedResponse) => {
          window.location.replace(`/host/${updatedResponse.id}`);
        });
    })
    .catch((error) => {
      console.error(error);
    });
  }, []); // eslint-disable-line

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
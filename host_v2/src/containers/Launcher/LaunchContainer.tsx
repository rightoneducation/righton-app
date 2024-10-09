import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IAPIClients, GameSessionState, PublicPrivateType } from '@righton/networking';
import LoadingPage from '../../pages/LoadingPage';

interface LaunchContainerProps {
  apiClients: IAPIClients;
  gameId: string;
}

export default function LaunchContainer({apiClients, gameId}: LaunchContainerProps) {
  const theme = useTheme();
  const publicPrivate = PublicPrivateType.PUBLIC;
  
  
  useEffect(() => {
    console.log('here');
    apiClients.gameSession.createGameSessionFromTemplate(gameId, publicPrivate).then((response) => {
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
    <LoadingPage />
  );
}
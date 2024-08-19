import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { APIClients, GameSessionState } from '@righton/networking';
import LoadingPage from '../../pages/LoadingPage';

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
    <LoadingPage />
  );
}
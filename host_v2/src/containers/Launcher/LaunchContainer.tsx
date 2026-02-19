import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IAPIClients, GameSessionState, PublicPrivateType } from '@righton/networking';
import LoadingPage from '../../pages/LoadingPage';
import { trackEvent, trackError, HostEvent } from '../../lib/analytics';

interface LaunchContainerProps {
  apiClients: IAPIClients;
  gameId: string;
  publicPrivate: PublicPrivateType;
}

export default function LaunchContainer({apiClients, gameId, publicPrivate}: LaunchContainerProps) {
  const theme = useTheme();
  
  
  useEffect(() => {
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
          trackEvent(HostEvent.GAME_SESSION_CREATED, {
            gameSessionId: updatedResponse.id,
            gameId,
            publicPrivate,
          });
          window.location.replace(`/host/${updatedResponse.id}`);
        });

    })
    .catch((error) => {
      console.error(error);
      trackError(HostEvent.GAME_SESSION_CREATION_FAILED, error, { gameId, publicPrivate });
    });
  }, []); // eslint-disable-line

  return (
    <LoadingPage />
  );
}
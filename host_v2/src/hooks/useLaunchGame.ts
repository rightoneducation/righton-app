import { useState, useEffect } from 'react';
import { IAPIClients, GameSessionState } from '@righton/networking';

interface UseLaunchGameProps {
  apiClients: IAPIClients;
  gameId: string;
}
export default function useLaunchGame({apiClients, gameId}: UseLaunchGameProps): void{
  useEffect(() => {
    apiClients.gameSession.createGameSessionFromTemplate(gameId).then((createResponse) => {
      if (!createResponse) {
        return;
      }
      apiClients.gameSession
        .updateGameSession({
          id: createResponse,
          currentState: GameSessionState.TEAMS_JOINING,
        })
        .then((updateResponse) => {
          window.location.replace(`/host/${updateResponse.id}`);
        });
    })
    .catch((error) => {
      console.error(error);
    });
  }, []); // eslint-disable-line
}
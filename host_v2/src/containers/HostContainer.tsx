import React, { useState } from 'react';
import { GameSessionState, APIClients, IGameSession} from '@righton/networking';
import useInitHostContainer from '../hooks/useInitHostContainer';
import GameSessionContainer from './GameSessionContainer';

interface HostContainerProps {
  apiClients: APIClients;
}

export default function HostContainer({apiClients}: HostContainerProps) {
  const gameSessionId = '0bcbd26e-17fb-414d-a63e-22ed5033a042';
  const backendGameSession = useInitHostContainer(apiClients, gameSessionId);

  if (backendGameSession){
    switch (backendGameSession.currentState){
      case GameSessionState.TEAMS_JOINING:
        default:
        return (
          <GameSessionContainer
            backendGameSession={backendGameSession}
          />
        );
    }
  } else {
    return null;
  }
}

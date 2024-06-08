import React, { useState } from 'react';
import { GameSessionState, APIClients, IGameSession} from '@righton/networking';
import useInitHostContainer from '../hooks/useInitHostContainer';
import StartGame from '../pages/StartGame';

interface GameSessionContainerProps {
  backendGameSession: IGameSession | null;
}

export default function GameSessionContainer({backendGameSession}: GameSessionContainerProps) {
  const [localGameSession, setLocalGameSession] = useState<IGameSession | null>(backendGameSession);
  const handleDeleteTeam = () => {}

  switch (backendGameSession?.currentState){
    case GameSessionState.TEAMS_JOINING:
      default:
      return (
        <StartGame
          teams={localGameSession?.teams ?? []}
          questions={localGameSession?.questions ?? []}
          title={localGameSession?.title ?? ''}
          gameCode={localGameSession?.gameCode ?? 0}
          handleDeleteTeam={handleDeleteTeam}
        />
      );
  }
}

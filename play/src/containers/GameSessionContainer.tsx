import React, { useState } from 'react';
import {
  IGameSession,
  IAWSGameSession,
  GameSessionParser,
} from '@righton/networking';
import MockGameSession from '../mock/MockGameSession.json';
import GameInProgress from '../pages/GameInProgress'; // eslint-disable-line @typescript-eslint/no-unused-vars
import JoinGame from '../pages/JoinGame';
import { JoinGameState } from '../lib/PlayModels';

export default function GameSessionContainer() {
  const [gameSession, setGameSession] = useState(     // eslint-disable-line @typescript-eslint/no-unused-vars

    GameSessionParser.gameSessionFromAWSGameSession(
      MockGameSession as IAWSGameSession
    ) as IGameSession
  );
  const [teamAvatar, setTeamAvatar] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [joinGameState, setjoinGameState] = useState<JoinGameState>( // eslint-disable-line @typescript-eslint/no-unused-vars
    JoinGameState.ENTER_GAME_CODE
  ); 


  return <JoinGame joinGameState={joinGameState} />;
}

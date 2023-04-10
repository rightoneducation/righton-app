import React, { useState } from 'react';
import {
  IGameSession,
  IAWSGameSession,
  GameSessionParser,
} from '@righton/networking';
import MockGameSession from '../mock/MockGameSession.json';
import GameInProgress from '../pages/GameInProgress';

export default function GameSessionContainer() {
  const [gameSession, setGameSession] = useState( // eslint-disable-line @typescript-eslint/no-unused-vars
    GameSessionParser.gameSessionFromAWSGameSession(
      MockGameSession as IAWSGameSession
    ) as IGameSession
  );
  const [teamAvatar, setTeamAvatar] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars

  return (
    <GameInProgress
      {...gameSession}
      teamAvatar={teamAvatar}
      teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
    />
  );
}

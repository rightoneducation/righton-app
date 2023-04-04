import React, { useState } from 'react';
import MockGameSession from '../mock/MockGameSession.json'
import { IGameSession, IAWSGameSession, GameSessionParser } from '@righton/networking';
import GameInProgress from '../pages/GameInProgress'

export default function GameSessionContainer() {

  const [gameSession, setGameSession] = useState(GameSessionParser.gameSessionFromAWSGameSession(MockGameSession as IAWSGameSession) as IGameSession);
  const [teamAvatar, setTeamAvatar] = useState(0);

  return(
    <GameInProgress {...gameSession} teamAvatar={teamAvatar} teamId={'2d609343-de50-4830-b65e-71eb72bb9bef'}/>
  )
}
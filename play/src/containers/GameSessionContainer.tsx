import React, { useState } from 'react';
import MockGameSession from '../mock/MockGameSession.json'
import { IGameSession, IAWSGameSession, GameSessionParser } from '@righton/networking';
import GameInProgress from '../pages/GameInProgress'

export default function GameSessionContainer() {

  const [gameSession, setGameSession] = useState(GameSessionParser.gameSessionFromAWSGameSession(MockGameSession as IAWSGameSession) as IGameSession);
  const [teamAvatar, setTeamAvatar] = useState(0);

  return(
    <GameInProgress gameSession={gameSession} teamAvatar={teamAvatar}/>
  )
}
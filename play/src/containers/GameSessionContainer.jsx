import React, {useState} from 'react';
import MockGameSession from '../mock/MockGameSession.json'
import GameInProgress from '../pages/GameInProgress'

export default function GameSessionContainer() {
  const [gameSession, setGameSession] = useState(MockGameSession);

  return(
    <GameInProgress {...gameSession} />
  )
}
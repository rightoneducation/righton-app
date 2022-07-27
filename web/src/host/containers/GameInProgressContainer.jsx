import React, {useEffect, useState} from 'react'
import GameInProgress from '../pages/GameInProgress'
import { loadGameSession, changeGameStatus } from '../../lib/hostAPI'
import { ApiClient, Environment, GameSessionState, IGameSession } from '@righton/networking'

const GameInProgressContainer = ({ gameSessionId }) => {
  const [gameSession, setGameSession] = useState()

  const handleChangeGameStatus = (currentState) => {
    changeGameStatus(currentState, gameSession).then((response) => {
      setGameSession(response);
    })
  }

  useEffect(() => {
    loadGameSession(gameSessionId).then((response) => {
      setGameSession(response)
    })
  }, [])
  
  if(!gameSession) {
    return null
  }

  return (
    <GameInProgress {...gameSession} handleChangeGameStatus={handleChangeGameStatus} />
  )
}

export default GameInProgressContainer
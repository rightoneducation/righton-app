import React, {useEffect, useState} from 'react'
import GameInProgress from '../pages/GameInProgress'
import { loadGameSession } from '../../lib/hostAPI'

const GameInProgressContainer = ({ gameSessionId }) => {
  const [gameSession, setGameSession] = useState()

  useEffect(() => {
    loadGameSession(gameSessionId).then((response) => {
      setGameSession(response)
    })
  }, [])
  
  if(!gameSession) {
    return null
  }

  return (
    <GameInProgress {...gameSession} />
  )
}

export default GameInProgressContainer
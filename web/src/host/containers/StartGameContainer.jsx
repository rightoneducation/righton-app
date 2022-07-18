import React, {useEffect, useState} from 'react'
import StartGame from '../pages/StartGame'
import { loadGameSession, removeTeam } from '../../lib/hostAPI'

const StartGameContainer = ({ gameSessionId }) => {
  const [gameSession, setGameSession] = useState()
  
  const handleRemoveTeam = (player) => {
    removeTeam(player.id, gameSession).then((response) => {
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
    <StartGame {...gameSession} removeTeam={handleRemoveTeam}/>
  )
}

export default StartGameContainer
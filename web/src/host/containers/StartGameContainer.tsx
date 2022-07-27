import React, {useEffect, useState} from 'react'
import StartGame from '../pages/StartGame'
import { loadGameSession, removeTeam } from '../../lib/hostAPI'
import { ApiClient, Environment, GameSessionState, IGameSession } from '@righton/networking'


const StartGameContainer = () => {
  const [gameSession, setGameSession] = useState<IGameSession | null>()
  

  let apiClient = new ApiClient(Environment.Staging)
  
  // const handleRemoveTeam = (player: { id: number }) => {
  //   removeTeam(player.id, gameSession).then((response) => {
  //     setGameSession(response);      
  //   })
  // }

  // useEffect(() => {
  //   loadGameSession(gameSessionId).then((response) => {
  //    setGameSession(response)
  //   })
  // }, [])

  useEffect(() => {
    apiClient.createGameSession(926, false)
            .then((response: any) => {
              setGameSession(response)
              console.log(response)
            }).catch((error: any) => {
              console.error(error.message)
              
            })
  }, [])

  if(!gameSession) {
    return null
  }
  return (
    <StartGame {...gameSession} />
  )
}

export default StartGameContainer
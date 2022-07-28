import React, {useEffect, useState} from 'react'
import StartGame from '../pages/StartGame'
import { loadGameSession, removeTeam } from '../../lib/hostAPI'
import { ApiClient, Environment, GameSessionState, IGameSession } from '@righton/networking'


const StartGameContainer = () => {
  
  const [gameSession, setGameSession] = useState<IGameSession | null>()
  

  let apiClient = new ApiClient(Environment.Staging)
  
  let gameSessionId = "a32a65bb-dd1f-4d06-a5ad-76d4f9db7074"
  //load game session
  useEffect(() => {
    apiClient.loadGameSession(gameSessionId).then(response => {
      setGameSession(response)
      console.log(response)
    })

    const subscription = apiClient.subscribeUpdateGameSession(response => {
      setGameSession(response)
    })
  
    // @ts-ignore
    return () => subscription.unsubscribe()
  }, [])

  if(!gameSession) {
    return null
  }
  return (
    <StartGame {...gameSession} />
  )
}

export default StartGameContainer



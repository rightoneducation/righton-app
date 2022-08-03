import React, {useEffect, useState} from 'react'
import {
 BrowserRouter as Router, Route, useParams, useRouteMatch
} from "react-router-dom";
import StartGame from '../pages/StartGame'
import { ApiClient, Environment, GameSessionState, IGameSession } from '@righton/networking'
import GameInProgress from '../pages/GameInProgress'
import Ranking from '../pages/Ranking';


const GameSessionContainer = () => {  
  const [gameSession, setGameSession] = useState<IGameSession | null>()


  let apiClient = new ApiClient(Environment.Staging)
  
  // paste this game session id into the url path a32a65bb-dd1f-4d06-a5ad-76d4f9db7074

   let { gameSessionId } = useParams<{gameSessionId: string}>()
   let { path } = useRouteMatch();


  useEffect(() => {
    apiClient.loadGameSession(gameSessionId).then(response => {
      setGameSession(response)
      console.log(response)
    })

    const subscription = apiClient.subscribeUpdateGameSession(response => {
      console.log(response)
    })
  
    // @ts-ignore
    return () => subscription.unsubscribe()
  }, [])
  
  if(!gameSession) {
    return null
  }

  switch (gameSession.currentState) {
    
    case GameSessionState.INITIAL_INTRO:
      return (
      <Route path={`${path}/que`}>
        <StartGame {...gameSession} gameSessionId={gameSessionId} />
      </Route>
      )
      
    case GameSessionState.CHOOSING_TRICK_ANSWER:
      return(
      <Route path={`${path}/start`}>
        <GameInProgress {...gameSession} />
      </Route>
      )
      
    case GameSessionState.REVIEWING_RESULT:
      return(
      <Route path={`${path}/ranking`}>
        <Ranking {...gameSession}/>
      </Route>
      )
  }
}

export default GameSessionContainer



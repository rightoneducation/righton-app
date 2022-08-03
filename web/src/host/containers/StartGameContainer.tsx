import React, {useEffect, useState} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import StartGame from '../pages/StartGame'
import { ApiClient, Environment, GameSessionState, IGameSession } from '@righton/networking'
import GameInProgress from '../pages/GameInProgress'
import Ranking from '../pages/Ranking';


const StartGameContainer = () => {
  
  const [gameSession, setGameSession] = useState<IGameSession | null>()
  

  let apiClient = new ApiClient(Environment.Staging)
  
  let gameSessionId = "a32a65bb-dd1f-4d06-a5ad-76d4f9db7074"

  // const handleChangeGameStatus = (currentState) => {
  //   changeGameStatus(currentState, gameSession).then((response) => {
  //     setGameSession(response);
  //   })
  // }

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
    //switch statement to determine which page to display - routing will go here
    //switch case for current game sessions state to render page components
    
    case GameSessionState.INITIAL_INTRO:
      <Route path="/host/:gameID">
        <StartGame {...gameSession} />
      </Route>
      break;
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
      <Route path="/game-in-progress/:gameID">
        <GameInProgress {...gameSession} />
      </Route>
      break;
    case GameSessionState.REVIEWING_RESULT:
      <Route path="/ranking/:gameID">
        <Ranking/>
      </Route>
  }
}

export default StartGameContainer



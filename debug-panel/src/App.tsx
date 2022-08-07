import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material'
import { ApiClient, Environment, GameSessionState } from '@righton/networking'
import { IGameSession } from '@righton/networking'

function App() {
  const [gameSession, setGameSession] = useState<IGameSession | null>()
  const [updatedGameSession, setUpdatedGameSession] = useState<IGameSession | null>()
  const [error, setError] = useState<string | null>(null)
  
  let apiClient = new ApiClient(Environment.Staging)
  let gameSessionSubscription: any | null = null

  useEffect(() => {  
    // @ts-ignore
    return () => gameSessionSubscription?.unsubscribe()
  }, [])


  const handleUpdateGameSessionState = (gameSessionState: GameSessionState) => {
    if (gameSession == null) {
      return
    }

    let gameSessionId = gameSession!.id

    apiClient.updateGameSession(gameSessionId, gameSessionState)
      .then(response => {
        setUpdatedGameSession(response)
        setError(null)
      }).catch(error => {
        console.error(error.message)
        setError(error.message)
        setUpdatedGameSession(null)
      })
  }
   
  return (
    <div>
      <span>
        {
          (gameSession == null ? "" : gameSession.id.toLocaleLowerCase()) +
          (error == null ? "" : error)
        }
      </span>
      <span>
        {
          (updatedGameSession != null) ?
            `Updated game session state to ${updatedGameSession?.currentState} for ${updatedGameSession?.id}` :
            ""
        }
      </span>
      <Button
        variant="contained"
        onClick={() => {
          apiClient.createGameSession(926, false)
            .then(gameSession => {
              setGameSession(gameSession)
              setError(null)
              setUpdatedGameSession(null)
              gameSessionSubscription = apiClient.subscribeUpdateGameSession(gameSession.id, gameSession => {
                  console.log(gameSession.currentState)
              })
            }).catch(error => {
              console.error(error.message)
              setGameSession(null)
              setError(error.message)
              setUpdatedGameSession(null)
            })
        }}
      >
        Create game session
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.TEAMS_JOINING)
        }}
      >
        Teams Joining
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.CHOOSE_CORRECT_ANSWER)
        }}
      >
        Choose Correct
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.PHASE_1_RESULTS)
        }}
      >
        Phase 1 Results
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.CHOOSE_TRICKIEST_ANSWER)
        }}
      >
        Choose Trickiest Answer
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.PHASE_2_RESULTS)
        }}
      >
        Phase 2 Results
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.FINAL_RESULTS)
        }}
      >
        Rankings
      </Button>
    </div>
  );
}

export default App;

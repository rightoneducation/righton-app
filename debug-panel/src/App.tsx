import React, { useEffect, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { ApiClient, Environment, GameSessionState } from '@righton/networking'
import { IApiClient } from '@righton/networking'
import { IGameSession } from '@righton/networking'

function App() {
  const [gameSession, setGameSession] = useState<IGameSession | null>()
  const [updatedGameSession, setUpdatedGameSession] = useState<IGameSession | null>()
  const [error, setError] = useState<string | null>(null)
  const [gameCode, setGameCode] = useState<number>(0)
  const [gameSessionID, setGameSessionID] = useState<string>("")

  let apiClient: IApiClient = new ApiClient(Environment.Staging)
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

    apiClient.updateGameSession({ id: gameSessionId, currentState: gameSessionState })
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
          apiClient.createGameSession(1156, false)
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
      <TextField
        value={gameCode}
        label="Outlined"
        variant="outlined"
        placeholder='Game code'
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        onChange={(e) => setGameCode(Number(e.target.value))}
      />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          apiClient.getGameSessionByCode(gameCode)
            .then(response => {
              if (response == null) {
                setError(`No game found for ${gameCode}`)
                setGameSession(null)
                return
              }
              console.log(response)
              setGameSession(response)
              setError(null)
            }).catch(error => {
              console.error(error.message)
              setError(error.message)
              setGameSession(null)
            })
        }}>
        Get Game Session by Code
      </Button>
      <TextField
        value={gameSessionID}
        label="Outlined"
        variant="outlined"
        placeholder='Game code'
        onChange={(e) => setGameSessionID(e.target.value)}
      />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          apiClient.getGameSession(gameSessionID)
            .then(response => {
              if (response == null) {
                setError(`No game found for ${gameSessionID}`)
                setGameSession(null)
                return
              }
              console.log(response)
              setGameSession(response)
              setError(null)
            }).catch(error => {
              console.error(error.message)
              setError(error.message)
              setGameSession(null)
            })
        }}>
        Get Game Session by ID
      </Button>
    </div>
  )
}

export default App

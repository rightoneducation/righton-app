import React, { useEffect, useRef, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { ApiClient, Environment, GameSessionState, ITeamAnswer } from '@righton/networking'
import { IApiClient } from '@righton/networking'
import { IGameSession, ITeam, ITeamMember } from '@righton/networking'

function App() {
  const [gameSession, setGameSession] = useState<IGameSession | null>()
  const [prevGameSessionId, setPrevGameSessionId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [gameCode, setGameCode] = useState<number>(0)
  const [gameSessionId, setgameSessionId] = useState<string>("")
  const [teamName, setTeamName] = useState<string>("")
  const [team, setTeam] = useState<ITeam | null>()
  const [teamMember, setTeamMember] = useState<ITeamMember | null>()
  const [teamAnswer, setTeamAnswer] = useState<ITeamAnswer | null>()


  const [apiClient, _] = useState<IApiClient>(new ApiClient(Environment.Staging))
  const gameSessionSubscription = useRef<any | null>(null)

  useEffect(() => {
    // @ts-ignore
    return () => gameSessionSubscription.current?.unsubscribe()
  }, [])

  const updateGameSession = (gameSession: IGameSession | null) => {
    setGameSession(gameSession)
    if (gameSession == null) {
      gameSessionSubscription.current?.unsubscribe()
      return
    }

    if (prevGameSessionId === gameSession.id) {
      return
    }

    setPrevGameSessionId(gameSession.id)

    gameSessionSubscription.current?.unsubscribe()
    gameSessionSubscription.current = apiClient.subscribeUpdateGameSession(gameSession.id, gameSession => {
      console.log(gameSession.currentState)
    })
  }


  const handleUpdateGameSessionState = (gameSessionState: GameSessionState) => {
    if (gameSession == null) {
      return
    }

    let gameSessionId = gameSession.id

    apiClient.updateGameSession({ id: gameSessionId, currentState: gameSessionState })
      .then(response => {
        updateGameSession(response)
        setError(null)
      }).catch(error => {
        console.error(error.message)
        setError(error.message)
        updateGameSession(null)
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
          (gameSession != null) ?
            `Updated game session state to ${gameSession?.currentState} for ${gameSession?.id}` :
            ""
        }
      </span>
      <Button
        variant="contained"
        onClick={() => {
          apiClient.createGameSession(1262, false)
            .then(gameSession => {
              updateGameSession(gameSession)
              setError(null)
            }).catch(error => {
              console.error(error.message)
              updateGameSession(null)
            })
        }}
      >
        Create game session
      </Button>
      <Button
        variant="contained"
        color='secondary'
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.TEAMS_JOINING)
        }}
      >
        Teams Joining
      </Button>
      <Button
        variant="contained"
        color='secondary'
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.CHOOSE_CORRECT_ANSWER)
        }}
      >
        Choose Correct
      </Button>
      <Button
        variant="contained"
        color='secondary'
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.PHASE_1_DISCUSS)
        }}
      >
        Phase 1 Discuss
      </Button>
      <Button
        variant="contained"
        color='secondary'
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.PHASE_1_RESULTS)
        }}
      >
        Phase 1 Results
      </Button>
      <Button
        variant="contained"
        color='secondary'
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.PHASE_2_START)
        }}
      >
        Phase 2 Start
      </Button>
      <Button
        variant="contained"
        color='secondary'
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.CHOOSE_TRICKIEST_ANSWER)
        }}
      >
        Choose Trickiest Answer
      </Button>
      <Button
        variant="contained"
        color='secondary'
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.PHASE_2_DISCUSS)
        }}
      >
        Phase 2 Discuss
      </Button>
      <Button
        variant="contained"
        color='secondary'
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.PHASE_2_RESULTS)
        }}
      >
        Phase 2 Results
      </Button>
      <Button
        variant="contained"
        color='secondary'
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.FINAL_RESULTS)
        }}
      >
        Rankings
      </Button>
      <Button
        variant="contained"
        color='secondary'
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.FINISHED)
        }}
      >
        Finished
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
                updateGameSession(null)
                return
              }
              console.log(response)
              updateGameSession(response)
              setError(null)
            }).catch(error => {
              console.error(error.message)
              setError(error.message)
              updateGameSession(null)
            })
        }}>
        Get Game Session by Code
      </Button>
      <TextField
        value={gameSessionId}
        variant="standard"
        placeholder='gameSessionId'
        onChange={(e) => setgameSessionId(e.target.value)}
      />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          apiClient.getGameSession(gameSessionId)
            .then(response => {
              if (response == null) {
                setError(`No game found for ${gameSessionId}`)
                updateGameSession(null)
                return
              }
              console.log(response)
              updateGameSession(response)
              setError(null)
            }).catch(error => {
              console.error(error.message)
              setError(error.message)
              updateGameSession(null)
            })
        }}>
        Get Game Session by ID
      </Button>
      <TextField
        value={teamName}
        variant="standard"
        placeholder='Team name'
        onChange={(e) => setTeamName(e.target.value)}
      />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          if (isNullOrUndefined(gameSession)) {
            return
          }
          apiClient.addTeamToGameSessionId(gameSession.id, teamName, null)
            .then(team => {
              if (team == null) {
                setError(`Failed to create team`)
                return
              }
              console.log(team)
              setTeam(team)
              setError(null)
            }).catch(error => {
              console.error(error.message)
              setError(error.message)
              setTeam(null)
            })
        }}>
        Add team
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          if (isNullOrUndefined(team)) {
            return
          }
          apiClient.addTeamMemberToTeam(team.id, false, 'some-device-id')
            .then(teamMember => {
              if (teamMember == null) {
                setError(`Failed to create team member`)
                return
              }
              console.log(teamMember)
              setError(null)
              setTeamMember(teamMember)
            }).catch(error => {
              console.error(error.message)
              setError(error.message)
              setTeamMember(null)
            })
        }}>
        Add team member
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          if (isNullOrUndefined(gameSession) ||
            isNullOrUndefined(gameSession.questions) ||
            isNullOrUndefined(team)
            || isNullOrUndefined(teamMember)) {
            return
          }
          const question = gameSession.questions[0]
          if (isNullOrUndefined(question)) {
            return null
          }
          if (isNullOrUndefined(question.choices) || question.choices.length == 0) {
            return null
          }
          const choice = question.choices[Math.floor(Math.random() * question.choices.length)]
          if (isNullOrUndefined(choice)) {
            return
          }
          apiClient.addTeamAnswer(teamMember.id,
            gameSession.questions[0].id,
            choice.text,
            true)
            .then(teamAnswer => {
              if (teamAnswer == null) {
                setError(`Failed to create answer`)
                return
              }
              console.log(teamAnswer)
              setError(null)
              setTeamAnswer(teamAnswer)
            }).catch(error => {
              console.error(error.message)
              setError(error.message)
              setTeamAnswer(null)
            })
        }}>
        Add team answer (basic)
      </Button>
    </div>
  )
}

function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined
}

export default App

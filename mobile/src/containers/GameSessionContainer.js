import React, { useState, useEffect } from "react"

const GameSessionContainer = ({ children }) => {
  const [gameCode, setGameCode] = useState(null)
  const [teamId, setTeamId] = useState(null)
  const [gameSession, setGameSession] = useState(null)

  useEffect(() => {
    let subscription

    if (gameCode) {
      global.apiClient
        .getGameSessionByCode(gameCode)
        .then((gameSessionResponse) => {
          setGameSession(gameSessionResponse)

          if (gameSessionResponse?.id) {
            subscription = global.apiClient.subscribeUpdateGameSession(
              gameSessionResponse.id,
              (gameSessionSubscriptionResponse) => {
                setGameSession(gameSessionSubscriptionResponse)
              }
            )
          }
        })
    }

    return () => subscription?.unsubscribe()
  }, [gameCode])

  useEffect(() => {
    // TODO: this is how you get to the correct page initially
    if (gameSession.currentState === "") {
      // navigate somewhere
    }
  }, [gameSession?.currentState])

  const usersTeam =
    teamId ?? gameSession?.teams?.find((team) => team.id === teamId)
  // TODO: make this work
  const user = usersTeam?.teamMembers?.[0]

  console.debug("game session in container:", gameSession)
  console.debug("user in container:", user)

  return children({
    gameSession,
    user,
    setGameCode,
    setTeamId,
  })
}

export default GameSessionContainer

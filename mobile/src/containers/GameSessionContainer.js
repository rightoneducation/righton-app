import React, { useState, useEffect } from "react"

const GameSessionContainer = ({ children }) => {
  const [gameCode, setGameCode] = useState(null)
  const [teamId, setTeamId] = useState(null)
  const [gameSession, setGameSession] = useState(null)
  const [teamMember, setTeamMember] = useState(null)

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
                //TODO: update the team object everytime the game session is updated
                //only update the team member if the team member is found
              }
            )
          }
        })
    }

    return () => subscription?.unsubscribe()
  }, [gameCode])

  // useEffect(() => {
  //   // TODO: this is how you get to the correct page initially
  //   if (gameSession.currentState === "") {
  //     // navigate somewhere
  //   }
  // }, [gameSession?.currentState])

  //const usersTeam =
  //teamId ?? gameSession?.teams?.find((team) => team.id === teamId)
  // TODO: make this work
  //const user = usersTeam?.teamMembers?.items?.[0]

  console.debug("game session in container:", gameSession)

  const setTeamInfo = (team, teamMember) => {
    setTeamId(team.id)
    setTeamMember(teamMember)
  }

  console.debug("team member in container:", teamMember)

  return children({
    gameSession,
    //user,
    setGameCode,
    setTeamInfo,
    teamId,
    teamMember,
  })
}

export default GameSessionContainer

import React, { useState, useEffect } from "react"
import EncryptedStorage from "react-native-encrypted-storage"

const GameSessionContainer = ({ children }) => {
  const [gameCode, setGameCode] = useState(null)
  const [teamId, setTeamId] = useState(null)
  const [gameSession, setGameSession] = useState(null)
  const [teamMember, setTeamMember] = useState(null)

  //add a way to save the updates to a session storage
  //load the session storage when the game session container loads
  //update initial useState values to load data from local storage
  //based on intial values - redirect to the current game screen
  //currentState.screenName

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

  async function storeGameSessionLocal() {
    try {
      const value = await EncryptedStorage.setItem(
        "localGameSession",
        JSON.stringify({
          gameCode: gameCode,
          teamId: teamId,
          teamMember: teamMember,
          gameSession: gameSession,
        })
      )
      console.log("stored game session locally", value)
    } catch (error) {
      // There was an error on the native side
      console.log("error storing game session", error)
    }
  }

  async function loadGameSessionLocal() {
    try {
      const value = await EncryptedStorage.getItem("localGameSession")
      if (value !== null) {
        // We have data!!
        console.log("local game session", value)
        return value
      }
    } catch (error) {
      // Error retrieving data
      console.log("error loading game session", error)
    }
  }

  useEffect(() => {
    loadGameSessionLocal()
    if (gameSession) {
      storeGameSessionLocal()
    }
  }, [gameSession])

  console.debug("game session in container:", gameSession)

  const setTeamInfo = (team, teamMember) => {
    setTeamId(team.id)
    setTeamMember(teamMember)
  }

  console.debug("team member in container:", teamMember)

  return children({
    gameSession,
    setGameCode,
    setTeamInfo,
    teamId,
    teamMember,
  })
}

export default GameSessionContainer

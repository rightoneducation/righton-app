import { GameSessionState, isNullOrUndefined, ModelHelper } from "@righton/networking"
import { useState } from "react"
import uuid from "react-native-uuid"
import EncryptedStorage from "react-native-encrypted-storage"
import TeamIcons from "./TeamIcons"

const localStorageKeys = {
    gameCode: "game_session_code",
    teamId: "team_id",
    teamMemberId: "team_member_id",
    teamAvatarId: "team_avatar_id"
}

async function storeDataToLocalStorage(value) {
    try {
        await EncryptedStorage.setItem("righton_session", value)
        return true
    } catch (error) {
        // There was an error on the native side
        console.error(`error storing: ${value} error: ${error}`)
        return false
    }
}

async function loadLocalStorage() {
    try {
        const value = await EncryptedStorage.getItem("righton_session")
        return value
    } catch (error) {
        // Error retrieving data
        console.debug(`error loading ${key} with error: error`)
        return null
    }
}

async function removeDataFromLocalStorage() {
    try {
        await EncryptedStorage.removeItem("righton_session")
        return true
    } catch (error) {
        // There was an error on the native side
        // You can find out more about this error by using the `error.code` property
        console.error(error.code) // ex: -25300 (errSecItemNotFound)
        return false
    }
}

async function clearStorage() {
    try {
        await EncryptedStorage.clear()
        // Congrats! You've just cleared the device storage!
        console.log("Successfully cleared storage!")
        return true
    } catch (error) {
        console.debug(`Failed to clear local storage ${error}`)
        // There was an error on the native side
        return false
    }
}

const GameSessionContainer = ({ children }) => {
    const [gameSession, setGameSession] = useState(null)
    const [team, setTeam] = useState(null)
    const [teamMember, setTeamMember] = useState(null)
    const [teamAvatar, setTeamAvatar] = useState(TeamIcons[0])

    const fetchGameSessionByCode = async (gameCode) => {
        return global.apiClient
            .getGameSessionByCode(gameCode)
            .then((gameSessionResponse) => {
                if (isNullOrUndefined(gameSessionResponse)) {
                    clearStorage()
                    throw new Error(`No game session found for gameCode: ${gameCode}`)
                }

                if (gameSessionResponse.currentState === GameSessionState.FINISHED ||
                    gameSessionResponse.currentState === GameSessionState.NOT_STARTED) {
                    clearStorage()
                    throw new Error(`GameSession is either finished or not started`)
                }
                setGameSession(gameSessionResponse)
                return gameSessionResponse
            })
    }

    const handleSubscribeToGame = (gameSession) => {
        if (isNullOrUndefined(gameSession)) {
            resetState()
            return
          }
          
          let subscription =
            global.apiClient.subscribeUpdateGameSession(
                gameSession.id,
                (gameSessionResponse) => {
                    setGameSession(gameSessionResponse)
                })
    }

    const handleAddTeam = async (teamName) => 
    {
      return global.apiClient
            .addTeamToGameSessionId(gameSession.id, teamName, null)
            .then((team) => {
                console.debug(team)
                setTeam(team)
                if (!team) {
                    console.error("Failed to add team")
                    return
                }
                else {
                  global.apiClient
                      .addTeamMemberToTeam(team.id, true, uuid.v4())
                      .then((teamMember) => {
                          if (!teamMember) {
                              console.error("Failed to add team member")
                              return
                          }
                          setTeam({...team, teamMembers: [teamMember]})
                          setTeamMemberInfo(teamMember)
                          return 
                      }).catch((error) => {
                          console.error(error)
                      })
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const handleAddTeamAnswer = async (question, answer, gameSessionState) =>
    {
      return  global.apiClient
                  .addTeamAnswer(
                      teamMember.id,
                      question.id,
                      answer.text,
                      gameSessionState === GameSessionState.CHOOSE_CORRECT_ANSWER ? true : false,
                      gameSessionState === GameSessionState.CHOOSE_CORRECT_ANSWER ? false : true
                  )
                  .then((teamAnswer) => {
                      if (teamAnswer == null) {
                          console.error(
                              "Failed to create team Answer."
                          )
                          return    
                      }
                      const newAnswers = (team.teamMembers[0].answers && team.teamMembers[0].answers.length) ? team.teamMembers[0].answers.concat(teamAnswer) : [teamAnswer]
                      setTeam({...team, teamMembers: [{...teamMember, answers: newAnswers}]})
                      console.debug(
                          "Team answer:",
                          teamAnswer
                      )
                  })
                  .catch((error) => {
                      console.error(error.message)
                  })
    }


    const setTeamInfo = async (team) => {
      //await storeDataToLocalStorage(localStorageKeys.teamId, team.id)
      setTeam(team)
    }

    const setTeamMemberInfo = async (teamMember) => {
      //await storeDataToLocalStorage(localStorageKeys.teamMemberId, teamMember.id)
      setTeamMember(teamMember)
    }

    const loadLocalSession = async () =>{
      console.log(await loadLocalStorage("righton_session"))
    }

    const saveLocalSession = async (avatar, team, gameSession) => {
      const session = JSON.stringify({
        gameCode: gameSession?.gameCode,
        teamName: team.id,
        teamAvatar: avatar.id
      })
      await storeDataToLocalStorage(session)
      setTeamAvatar(avatar)
    }

    const handleRejoinGame = async (prevGameData) =>{
      console.log(JSON.parse(prevGameData))
    }

    return children({
        gameSession,
        fetchGameSessionByCode,
        setTeamInfo,
        team,
        teamMember,
        teamAvatar,
        saveLocalSession,
        loadLocalSession,
        clearStorage,
        handleSubscribeToGame,
        handleAddTeam,
        handleAddTeamAnswer,
        handleRejoinGame
    })
}

export default GameSessionContainer

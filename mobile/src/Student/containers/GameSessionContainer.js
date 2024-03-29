import { GameSessionState, isNullOrUndefined, ModelHelper } from "@righton/networking"
import { useState } from "react"
import uuid from "react-native-uuid"
import EncryptedStorage from "react-native-encrypted-storage"
import TeamIcons from "./TeamIcons"

const GameSessionContainer = ({ children }) => {
    const [gameSession, setGameSession] = useState(null)
    const [team, setTeam] = useState(null)
    const [teamMember, setTeamMember] = useState(null)
    const [teamAvatar, setTeamAvatar] = useState(TeamIcons[0])
    const [isRejoin, setIsRejoin] = useState(false)

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
                if (isRejoin === false)
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

    const handleAddTeam = async (teamName, avatar) => 
    {
      return global.apiClient
            .addTeamToGameSessionId(gameSession.id, teamName, null)
            .then((team) => {
                console.debug(team)
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
                          setTeamMember(teamMember)
                          saveLocalSession(avatar, team, gameSession) // team data saved to local storage when team is added
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
      setTeam(team)
    }

    const saveTeamAvatar = async (teamAvatar) => {
      setTeamAvatar(teamAvatar)
    }

    const loadLocalSession = async () => {
      try {
        const value = await EncryptedStorage.getItem("righton_session")
        return value
      } catch (error) {
        console.debug(`error loading ${key} with error: error`)
        return null
      }
    }

    const saveLocalSession = async (avatar, team, gameSession) => {
      const session = JSON.stringify({
        gameCode: gameSession?.gameCode,
        teamName: team.id,
        teamAvatar: avatar
      })
      try {
        await EncryptedStorage.setItem("righton_session", session)
        return true
      } catch (error) {
        console.error(`error storing: ${value} error: ${error}`)
        return false
      }
    }

    const clearLocalSession = async (fromModal) => {
      try {
        await EncryptedStorage.removeItem("righton_session")
        setIsRejoin(false)
        // TODO clear the team off the gamesession if the clear message came from the modal (so the player doesn't join the game twice)
        return true
      } catch (error) {
        return false
      }
    }

    const handleRejoinSession = async (prevGameData) =>{
      setIsRejoin(true)
      const gameObj = JSON.parse(prevGameData)
      fetchGameSessionByCode(gameObj.gameCode).then(game => {
        const team = game.teams?.find(teamElement => teamElement.id === gameObj.teamName)
        setTeam(team)
        setTeamMember(team.teamMembers[0])
        setTeamAvatar(gameObj.teamAvatar)
        handleSubscribeToGame(game)
      })
    }

    return children({
        gameSession,
        fetchGameSessionByCode,
        setTeamInfo,
        team,
        teamMember,
        teamAvatar,
        loadLocalSession,
        clearLocalSession,
        handleSubscribeToGame,
        handleAddTeam,
        handleAddTeamAnswer,
        handleRejoinSession,
        saveTeamAvatar,
        isRejoin,
        setIsRejoin
    })
}

export default GameSessionContainer

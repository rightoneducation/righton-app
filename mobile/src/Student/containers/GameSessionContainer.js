import { GameSessionState, isNullOrUndefined, ModelHelper } from "@righton/networking"
import { useEffect, useRef, useState } from "react"
import uuid from "react-native-uuid"
import { useNavigation } from '@react-navigation/native'
import EncryptedStorage from "react-native-encrypted-storage"
import TeamIcons from "./TeamIcons"

const localStorageKeys = {
    gameCode: "game_session_code",
    teamId: "team_id",
    teamMemberId: "team_member_id",
    teamAvatarId: "team_avatar_id",
}

async function storeDataToLocalStorage(key, value) {
    try {
        // TODO: Fix reloading data from storage
        return true
        // END disabling loading from storage
        await EncryptedStorage.setItem(key, value)
        console.log(`stored new value locally ${key}: ${value}`)
        return true
    } catch (error) {
        // There was an error on the native side
        console.error(`error storing ${key}: ${value} error: ${error}`)
        return false
    }
}

async function loadLocalStorageForKey(key) {
    try {
        const value = await EncryptedStorage.getItem(key)
        if (isNullOrUndefined(value)) {
            console.debug(`No data found in local storage for ${key}`)
            return null
        }
        // We have data!!
        console.log(
            "loaded existing game session from local storage:",
            value
        )
        return value
    } catch (error) {
        // Error retrieving data
        console.debug(`error loading ${key} with error: error`)
        return null
    }
}

async function removeDataFromLocalStorage(key) {
    try {
        await EncryptedStorage.removeItem(key)
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
 
    const navigation = useNavigation()

    // let countdown = useRef()
    // let phaseTime = gameSession?.phaseOneTime ?? 300
    // const [currentTime, setCurrentTime] = useState(phaseTime)
    // const [progress, setProgress] = useState(1)
    const [submitted, setSubmitted] = useState(false)


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
 
      storeDataToLocalStorage(localStorageKeys.gameCode, `${gameSession.gameCode}`)
      
      let subscription =
      global.apiClient.subscribeUpdateGameSession(
          gameSession.id,
          (gameSessionResponse) => {
              setGameSession(gameSessionResponse)
              // TODO: Handle edge cases like user hasn't selected a team but state is on 
              // phase results or more advance
              switch (gameSessionResponse.currentState) {
                case GameSessionState.NOT_STARTED:
                    resetState()
                    break

                case GameSessionState.TEAMS_JOINING:
                    // Game hasn't started yet, just let the kids join
                    navigation.navigate("StudentName")
                    break

                case GameSessionState.CHOOSE_CORRECT_ANSWER:
                    //navigation.navigate("PhaseOneBasicGamePlay")
                    //phaseTime = gameSession?.phaseOneTime ?? 300
                    //setCurrentTime(phaseTime)
                    navigation.navigate("PregameCountDown")
                    break

                case GameSessionState.PHASE_1_DISCUSS:
                    navigation.navigate("PhaseOneBasicGamePlay")
                    break

                case GameSessionState.PHASE_2_START:
                    setSelectedAnswerIndex(null)
                    navigation.navigate("StartPhase")
                    break

                case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
                case GameSessionState.PHASE_2_DISCUSS:
                    phaseTime = gameSession?.phaseTwoTime ?? 300
                    setCurrentTime(phaseTime)
                    navigation.push("PhaseTwoBasicGamePlay")
                    break

                // case GameSessionState.PHASE_1_RESULTS:
                // case GameSessionState.PHASE_2_RESULTS:
                //     navigation.push("PhaseResult")
                //     break

                case GameSessionState.FINAL_RESULTS:
                    navigation.navigate("ScorePage")
                    break

                case GameSessionState.FINISHED:
                    resetState()
                    break

                default:
                    resetState()
                    console.error(`Unhandled state: ${gameSession.currentState}`)
                    break
            }  
          }
      )
    }

    const handleAddTeam = async (teamName) => 
    {
      return global.apiClient
            .addTeamToGameSessionId(gameSession.id, teamName, null)
            .then((team) => {
                console.debug(team)
                if (!team) {
                    console.error("Failed to add team")
                    return
                }


                global.apiClient
                    .addTeamMemberToTeam(team.id, true, uuid.v4())
                    .then((teamMember) => {
                        if (!teamMember) {
                            console.error("Failed to add team member")
                            return
                        }

                        if (isNullOrUndefined(team.teamMembers)) {
                            team.teamMembers = [teamMember]
                        }

                        return setTeamInfo(team, teamMember)
                    }).catch((error) => {
                        console.error(error)
                    })
            })
            .catch((error) => {
                console.error(error)
            })
    }
    const handleAddTeamAnswer = async (question, answer) =>
    {
      return  global.apiClient
                  .addTeamAnswer(
                      teamMember.id,
                      question.id,
                      answer.text,
                      answer.isChosen ? null : true,
                      false
                  )
                  .then((teamAnswer) => {
                      if (teamAnswer == null) {
                          console.error(
                              "Failed to create team Answer."
                          )
                          return
                      }
                      console.debug(
                          "Team answer:",
                          teamAnswer
                      )
                  })
                  .catch((error) => {
                      console.error(error.message)
                  })
    }

    const resetState = () => {
      clearStorage()
      navigation.navigate("JoinGame")
    }

    const setTeamInfo = async (team, teamMember) => {
        await storeDataToLocalStorage(localStorageKeys.teamId, team.id)
        await storeDataToLocalStorage(localStorageKeys.teamMemberId, teamMember.id)
        setTeam(team)
        setTeamMember(teamMember)
    }

    const saveTeamAvatar = (avatar) => {
        storeDataToLocalStorage(localStorageKeys.teamAvatarId, `${avatar.id}`)
        setTeamAvatar(avatar)
    }

    // //progress bar timer used in CHOOSE_CORRECT_ANSWER and CHOOSE_TRICKIEST_ANSWER
    // useEffect(() => {
    //   if (gameSession?.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || gameSession?.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER){
    //     if (
    //         currentTime <= 0 || // Out of time!
    //         // Game has moved on, so disable answering
    //         gameSession?.currentState !== GameSessionState.CHOOSE_CORRECT_ANSWER || gameSession?.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER
    //     ) {
    //         setSubmitted(true)
    //     }
    //     countdown.current = setInterval(() => {
    //         if (currentTime > 0) {
    //             setCurrentTime(currentTime - 1)
    //         }
    //         setProgress((currentTime - 1) / phaseTime)
    //     }, 1000)
    //     return () => {
    //         clearInterval(countdown.current)
    //     }
    //   }
    // }, [currentTime])

    return children({
        gameSession,
        fetchGameSessionByCode,
        setTeamInfo,
        team,
        teamMember,
        teamAvatar,
        saveTeamAvatar,
        //selectedAnswerIndex,
        //setSelectedAnswerIndex,
        //currentTime,
        //progress,
        submitted,
        setSubmitted,
        clearStorage,
        handleSubscribeToGame,
        handleAddTeam,
        handleAddTeamAnswer
    })
}

export default GameSessionContainer

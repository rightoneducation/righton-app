import { GameSessionState } from "@righton/networking"
import { useEffect, useState } from "react"
import EncryptedStorage from "react-native-encrypted-storage"

async function storeGameSessionLocal(gameSession, teamId, teamMember, gameCode) {
    try {
        const localGameSession = await EncryptedStorage.setItem(
            "localGameSession",
            // TODO: maybe we should spread the existing value here and only add 
            // values with updates
            JSON.stringify({
                gameSession: gameSession,
                teamId: teamId,
                teamMember: teamMember,
                gameCode: gameCode,
            })
        )
        console.debug("stored new game session locally:", localGameSession)
    } catch (error) {
        // There was an error on the native side
        console.debug("error storing game session", error)
    }
}

async function loadLocalGameSession() {
    try {
        const value = await EncryptedStorage.getItem("localGameSession")
        if (value !== null) {
            // We have data!!
            console.debug(
                "loaded existing game session from local storage:",
                value
            )
            return JSON.parse(value)
        }
    } catch (error) {
        // Error retrieving data
        console.debug("error loading game session", error)
    }
}

async function removeGameSessionLocal() {
    try {
        await EncryptedStorage.removeItem("localGameSession")
    } catch (error) {
        // There was an error on the native side
        // You can find out more about this error by using the `error.code` property
        console.debug(error.code) // ex: -25300 (errSecItemNotFound)
    }
}

const GameSessionContainer = ({ children }) => {
    const [gameCode, setGameCode] = useState(null)
    const [teamId, setTeamId] = useState(null)
    const [team, setTeam] = useState(null)
    const [gameSession, setGameSession] = useState(null)
    const [teamMember, setTeamMember] = useState(null)

    // NOTE: Enable this during development to load a local game session
    // useEffect(() => {
    //     loadLocalGameSession().then((localStorageData) => {
    //         if (localStorageData) {
    //             setGameSession(localStorageData.gameSession)
    //             setTeamId(localStorageData.teamId)
    //             setTeamMember(localStorageData.teamMember)
    //             setGameCode(localStorageData.gameSession.gameCode)
    //         }
    //     })
    // }, [])

    useEffect(() => {
        let subscription

        if (gameCode) {
            global.apiClient
                .getGameSessionByCode(gameCode)
                .then((gameSessionResponse) => {
                    setGameSession(gameSessionResponse)
                    if (gameSessionResponse?.id) {
                        subscription =
                            global.apiClient.subscribeUpdateGameSession(
                                gameSessionResponse.id,
                                (gameSessionSubscriptionResponse) => {
                                    setGameSession(
                                        gameSessionSubscriptionResponse
                                    )
                                    console.debug(gameSessionSubscriptionResponse)
                                    if (team || teamId) {
                                        const newTeamObj =
                                            gameSessionSubscriptionResponse.teams.find(
                                                (team) => team.id === teamId
                                            )
                                        // only update the team member if the team member is found
                                        if (newTeamObj) {
                                            const newTeamMemberObj = newTeamObj.teamMembers.find(
                                                (item) => item.id === teamMember.id
                                            )
                                            if (newTeamMemberObj) setTeamMember(newTeamMemberObj)
                                        }
                                    }
                                }
                            )
                    }
                })
        }

        return () => subscription?.unsubscribe()
    }, [gameCode])

    useEffect(() => {
        // TODO: team id and team member should only be updated if they are non-null
        if (gameSession?.gameCode) {
            storeGameSessionLocal(gameSession, teamId, teamMember, gameCode)
        } else {
            removeGameSessionLocal()
        }

        // clear local storage when the game is finished
        if (gameSession?.currentState === GameSessionState.FINISHED) {
            removeGameSessionLocal()
        }
    }, [gameSession])

    const setTeamInfo = (team, teamMember) => {
        setTeamId(team.id)
        setTeam(team)
        setTeamMember(teamMember)
    }

    return children({
        gameSession,
        setGameCode,
        setTeamInfo,
        team,
        teamId,
        teamMember,
    })
}

export default GameSessionContainer

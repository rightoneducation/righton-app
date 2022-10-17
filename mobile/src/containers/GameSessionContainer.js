import React, { useState, useEffect } from "react"
import EncryptedStorage from "react-native-encrypted-storage"
import { GameSessionState } from "@righton/networking"

const GameSessionContainer = ({ children }) => {
    const [gameCode, setGameCode] = useState(null)
    const [teamId, setTeamId] = useState(null)
    const [gameSession, setGameSession] = useState(null)
    const [teamMember, setTeamMember] = useState(null)

    useEffect(() => {
        if (gameSession) {
            storeGameSessionLocal()
        }
        loadLocalGameSession().then((localGameSession) => {
            if (localGameSession) {
                setGameSession(localGameSession.gameSession)
                setTeamId(localGameSession.teamId)
                setTeamMember(localGameSession.teamMember)
                setGameCode(localGameSession.gameCode)
            }
        })
    }, [])

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
                                    //TODO: update the team object everytime the game session is updated
                                    //only update the team member if the team member is found
                                    //if(teamMember){setTeamMember(teamMember)}
                                }
                            )
                    }
                })
        }

        return () => subscription?.unsubscribe()
    }, [gameCode])

    useEffect(() => {
        //clear local storage when the game is finished
        if (GameSessionState.FINISHED) {
            removeGameSessionLocal()
        }
    }, [gameSession?.currentState])

    async function storeGameSessionLocal() {
        try {
            const localGameSession = await EncryptedStorage.setItem(
                "localGameSession",
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

    const setTeamInfo = (team, teamMember) => {
        setTeamId(team.id)
        setTeamMember(teamMember)
    }

    console.debug("game session in container:", gameSession)
    console.debug("team member in container:", teamMember)
    console.debug("team in container:", teamId)

    return children({
        gameSession,
        setGameCode,
        setTeamInfo,
        teamId,
        teamMember,
    })
}

export default GameSessionContainer

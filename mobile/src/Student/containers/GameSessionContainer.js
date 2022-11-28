import { GameSessionState, isNullOrUndefined, ModelHelper } from "@righton/networking"
import { useEffect, useState } from "react"
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

    useEffect(() => {
        // TODO: Disabling local storage for now and fixing previous builds with it
        clearStorage()
        return
        const loadGameCode = async () => {
            return loadLocalStorageForKey(localStorageKeys.gameCode)
                .then((localGameCode) => {
                    if (isNullOrUndefined(localGameCode) ||
                        parseInt(localGameCode) === 0) {
                        throw new Error("No game code exists in local storage!")
                    }

                    return parseInt(localGameCode)
                })
        }

        loadGameCode()
            .then(localGameCode => {
                return fetchGameSessionByCode(localGameCode)
            })
            .then(() => {
                return loadLocalStorageForKey(localStorageKeys.teamId)
            })
            .then(teamId => {
                if (isNullOrUndefined(teamId)) {
                    throw new Error("No teamId exists!")
                }

                return ModelHelper.findTeamInGameSession(gameSession, teamId)
            })
            .then(team => {
                if (isNullOrUndefined(team)) {
                    removeDataFromLocalStorage(localStorageKeys.teamId)
                    throw new Error("No team found!")
                }
                setTeam(team)
                return loadLocalStorageForKey(localStorageKeys.teamMemberId)
            })
            .then(teamMemberId => {
                if (isNullOrUndefined(teamMemberId)) {
                    throw new Error("No teamMemberId found in local storage!")
                }
                return ModelHelper(team, teamMemberId)
            })
            .then(teamMember => {
                if (isNullOrUndefined(teamMember)) {
                    removeDataFromLocalStorage(localStorageKeys.teamMemberId)
                    throw new Error("No team member found!")
                }
                setTeamMember(teamMember)
                return loadLocalStorageForKey(localStorageKeys.teamAvatarId)
            })
            .then(teamAvatarId => {
                if (isNullOrUndefined(teamAvatarId) ||
                    parseInt(teamAvatarId) === 0) {
                    return
                }
                let avatar = TeamIcons.find(avatar => avatar.id === parseInt(teamAvatarId))
                setTeamAvatar(avatar)
            })
            .catch(error => {
                console.debug(`GameSessionContainer::useEffect: ${error}`)
            })
    }, [])

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

    useEffect(() => {
        if (isNullOrUndefined(gameSession)) {
            clearStorage()
            return
        }

        storeDataToLocalStorage(localStorageKeys.gameCode, `${gameSession.gameCode}`)

        let subscription =
            global.apiClient.subscribeUpdateGameSession(
                gameSession.id,
                (gameSessionResponse) => {
                    setGameSession(gameSessionResponse)
                })

        return () => subscription?.unsubscribe()
    }, [gameSession])

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

    return children({
        gameSession,
        fetchGameSessionByCode,
        setTeamInfo,
        team,
        teamMember,
        teamAvatar,
        saveTeamAvatar,
        clearStorage,
    })
}

export default GameSessionContainer

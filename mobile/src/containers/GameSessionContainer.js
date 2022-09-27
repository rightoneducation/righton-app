import React, { useState, useEffect } from "react"

const GameSessionContainer = () => {
    const [gameSession, setGameSession] = useState(null)

    useEffect(() => {
        global.apiClient.getGameSessionByCode(gameCode).then((response) => {
            setGameSession(response)

            global.apiClient.subscribeUpdateGameSession(
                gameSessionId,
                (response) => {
                    setGameSession({ ...gameSession, ...response })
                }
            )
        })
    }, [])

    return <div></div>
}

export default GameSessionContainer

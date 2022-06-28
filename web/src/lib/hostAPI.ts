import mockGameSession from'../mocks/gamesession.json'

export const loadGameSession = async (gameSessionId: string) => {
  const gameSession = await Promise.resolve(mockGameSession)
    return gameSession
}

export const removeTeam = async (gameSessionId: string) => {
    const gameSession = await Promise.resolve(mockGameSession)
      return gameSession
  }
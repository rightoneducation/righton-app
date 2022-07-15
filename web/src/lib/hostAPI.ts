import mockGameSession from '../mocks/gamesession.json'

export const loadGameSession = async (gameSessionId: any) => {
  const gameSession = await Promise.resolve(mockGameSession)
  return gameSession
}

export const removeTeam = async (teamId: number, gameSession: any) => {
  const updatedGameSession = {...gameSession,
    teams: {
      items: gameSession.teams.items.filter((team: { id: number }) => team.id !== teamId),}}
  return updatedGameSession
}

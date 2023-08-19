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

export const changeGameStatus = async (currentState: any, gameSession: any) => {
  const gameStatuses = [
    "INITIAL_INTRO",
    "REVIEWING_RESULT",
    "CHOOSING_TRICK_ANSWER",
    "FINISHED",
  ]
  const updatedGameSession = {...gameSession, currentState: gameStatuses[(gameStatuses.indexOf(currentState) !== (gameStatuses.length-1) ? gameStatuses.indexOf(currentState)+1 : 0)]}
  return updatedGameSession
}
import { UpdateGameSessionInput } from './AWSMobileApi'
import { ITeamAnswer, ITeamMember } from './Models'
import { IGameSession } from './Models/IGameSession'
import { ITeam } from './Models/ITeam'

export interface IApiClient {
    createGameSession(gameId: number, isAdvancedMode: Boolean): Promise<IGameSession>
    getGameSession(id: string): Promise<IGameSession>
    updateGameSession(awsGameSessionInput: UpdateGameSessionInput): Promise<IGameSession>
    subscribeUpdateGameSession(id: string, callback: (result: IGameSession) => void): any
    getGameSessionByCode(gameCode: number): Promise<IGameSession | null>
    addTeamToGameSessionId(gameSessionId: string, firstName: string, lastName: string, questionId: string | null): Promise<ITeam>
    addTeamMemberToTeam(teamId: string, isFacilitator: boolean, deviceId: string): Promise<ITeamMember>
    addTeamAnswer(teamMemberId: string, questionId: number, text: string, isChosen: boolean | null): Promise<ITeamAnswer>
}
import { UpdateGameSessionInput } from './AWSMobileApi'
import { ITeamMember, ITeam, NumberAnswer, StringAnswer, ExpressionAnswer } from './Models'
import { IGameSession } from './Models/IGameSession'

export interface IApiClient {
    createGameSession(gameId: number, isAdvancedMode: Boolean): Promise<IGameSession>
    getGameSession(id: string): Promise<IGameSession>
    updateGameSession(awsGameSessionInput: UpdateGameSessionInput): Promise<IGameSession>
    subscribeUpdateGameSession(id: string, callback: (result: IGameSession) => void): any
    getGameSessionByCode(gameCode: number): Promise<IGameSession | null>
    addTeamToGameSessionId(gameSessionId: string, name: string, questionId: string | null): Promise<ITeam>
    addTeamMemberToTeam(teamId: string, isFacilitator: boolean, deviceId: string): Promise<ITeamMember>
    addTeamAnswer(teamMemberId: string, questionId: string, text: string, awsAnswerContents: string, isChosen: boolean, isTrickAnswer: boolean): Promise<ITeamAnswer>
}
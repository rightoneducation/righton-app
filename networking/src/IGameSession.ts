import { GameSessionState } from "./AWSMobileApi"

export interface IGameSession {
    id: String
    gameId: number
    startTime?: string | null
    phaseOneTime: number
    phaseTwoTime: number
    // teams: [Team]?
    currentQuestionId?: number | null
    currentState: GameSessionState
    gameCode: number
    // questions: [Question]?
    updatedAt: string
    createdAt: string
}
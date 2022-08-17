import { GameSessionState } from "../AWSMobileApi"
import { IQuestion } from "./IQuestion"
import { ITeam } from "./ITeam"

export interface IGameSession {
    id: string
    gameId: number
    startTime?: string | null
    phaseOneTime: number
    phaseTwoTime: number
    teams?: Array<ITeam>
    currentQuestionId?: number | null
    currentState: GameSessionState
    gameCode: number
    currentTimer?: number | null
    questions: Array<IQuestion>
    updatedAt: string
    createdAt: string
}
import { GameSessionState } from "../AWSMobileApi"
import { IQuestion } from "./IQuestion"
import { ITeam } from "./ITeam"

export interface IGameSession {
    id: string
    gameId: number
    startTime: string
    phaseOneTime: number
    phaseTwoTime: number
    teams?: Array<ITeam>
    currentQuestionIndex: number
    currentState: GameSessionState
    gameCode: number
    isAdvancedMode: boolean
    currentTimer: number
    questions: Array<IQuestion>
    title: string
    updatedAt: string
    createdAt: string
}
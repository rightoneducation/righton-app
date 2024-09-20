import { GameSessionState } from "../AWSMobileApi"
import { IQuestion } from "./IQuestion"
import { ITeam } from "./ITeam"
import { IHostTeamAnswers } from "./IHostTeamAnswers"

export interface IGameSession {
    id: string
    gameId: number
    startTime: string
    phaseOneTime: number
    phaseTwoTime: number
    teams: Array<ITeam>
    currentQuestionIndex: number
    currentState: GameSessionState
    gameCode: number
    isAdvancedMode: boolean
    currentTimer: number
    sessionData: IHostTeamAnswers
    questions: Array<IQuestion>
    title: string
    updatedAt: string
    createdAt: string
}
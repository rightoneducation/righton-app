import { ConfidenceLevel } from "../AWSMobileApi";
import { INormAnswer } from "./ITeamAnswerContent";

export interface IQuestion {
    id: number
    text: string
    choices?: Array<IChoice> | null
    answerSettings?: IAnswerSettings | null
    responses?: Array<IResponse> | null
    imageUrl?: string | null
    instructions?: Array<string> | null
    standard?: string | null
    cluster?: string | null
    domain?: string | null
    grade?: string | null
    gameSessionId: string
    order: number
    isConfidenceEnabled: boolean
    isShortAnswerEnabled: boolean
    isHintEnabled: boolean
}

export interface IChoice {
    id?: string
    text: string
    reason?: string
    isAnswer: boolean
}

export interface IAnswerSettings {
    answerType: string
    answerPrecision: string
}

export interface IResponse {
    value: string
    normAnswer: INormAnswer[];
    isCorrect: boolean
    isSelectedMistake: boolean
    count: number
    teams: Array<IResponseTeam>
}

export interface IResponseTeam {
    team: string
    id: string
    confidence: ConfidenceLevel
}
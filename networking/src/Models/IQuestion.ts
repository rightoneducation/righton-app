import { ConfidenceLevel } from "../AWSMobileApi";

export interface IQuestion {
    id: number
    text: string
    choices?: Array<IChoice> | null
    responses?: Array<IResponse> | null
    imageUrl?: string | null
    instructions?: Array<string> | null
    standard?: string | null
    cluster?: string | null
    domain?: string | null
    grade?: string | null
    gameSessionId: string
    order: number
    isHintEnabled: boolean
    isConfidenceEnabled: boolean
    isShortAnswerEnabled: boolean
}

export interface IChoice {
    text: string
    reason?: string
    isAnswer: boolean
}

export interface IResponse {
    value: string
    normAnswer: string | number
    isCorrect: boolean
    count: number
    teams: Array<IResponseTeam>
}

export interface IResponseTeam {
    team: string
    id: string
    confidence: ConfidenceLevel
}
import { ConfidenceLevel } from "../AWSMobileApi";
import { AnswerType, AnswerPrecision } from "./AnswerClasses";

export interface IQuestion {
    id: string
    text: string
    choices?: Array<IChoice> | null
    answerSettings?: IAnswerSettings | null
    responses?: Array<IResponse> | null
    hints?: IHints[] | null
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
    answerType: AnswerType
    answerPrecision?: AnswerPrecision
}

export interface IResponse {
    rawAnswer: string
    normAnswer: string[]
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

export interface IHints {
    themeText: string;
    teams: string[];
    teamCount: number;
}
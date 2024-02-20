import { ConfidenceLevel } from "../AWSMobileApi";
import { AnswerPrecision, AnswerType } from "./AnswerClasses";

export interface IQuestion {
    id: string
    text: string
    choices: Array<IChoice>
    responses: Array<string>
    imageUrl: string
    instructions: Array<string>
    standard: string
    cluster: string
    domain: string
    grade: string
    gameSessionId: string
    order: number
    isConfidenceEnabled: boolean
    isShortAnswerEnabled: boolean
    isHintEnabled: boolean
}

export interface IChoice {
    id?: string
    text: string
    reason: string
    isAnswer: boolean
}

export interface IAnswerSettings {
    answerType: AnswerType
    answerPrecision: AnswerPrecision
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
    teams: {
        name: string;
        rawHint: string;
    }[];
    teamCount: number;
}
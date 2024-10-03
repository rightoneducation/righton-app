import { ConfidenceLevel } from "../AWSMobileApi";
import { AnswerType, AnswerPrecision } from "./AnswerClasses";
import { IHostTeamAnswersQuestion } from "./IHostTeamAnswers";

export interface IQuestion {
    id: string
    text: string
    choices: Array<IChoice>
    answerSettings: IAnswerSettings
    answerData: IHostTeamAnswersQuestion
    hints: Array<IHints>
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
    answerPrecision?: AnswerPrecision
}

export interface IResponse {
    rawAnswer: string
    normAnswer: string[]
    isCorrect: boolean
    isSelectedMistake: boolean
    count: number
    teams: string[]
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
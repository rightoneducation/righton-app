import { ConfidenceLevel } from "../AWSMobileApi";
import { INormAnswer } from "./ITeamAnswerContent";
import { ITeamAnswerHint } from "./ITeamAnswer";

export interface IQuestion {
    id: number
    text: string
    choices?: Array<IChoice> | null
    responses?: Array<IResponse> | null
    hints?: IHints | null
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

export interface IHints {
    prevSubmittedHints: Array<ITeamAnswerHint>,
    finalArray: {
        matchingWord: string,
        teamsMatched: string[],
        hintCount: number
    }
}
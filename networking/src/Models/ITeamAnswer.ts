import { ConfidenceLevel } from "../AWSMobileApi";
import { ITeamAnswerContent } from "./ITeamAnswerContent";

export interface ITeamAnswerHint {
    delta: string;
    rawHint: string;
    normHint?: string[];
    teamName: string;
    isHintSubmitted: boolean;
}

export interface ITeamAnswer {
    id: string,
    questionId: number
    isChosen: boolean
    text: string
    answerContent: ITeamAnswerContent
    createdAt?: string
    updatedAt?: string
    teamMemberAnswersId?: string | null
    isTrickAnswer: boolean
    confidenceLevel: ConfidenceLevel
    hint?: ITeamAnswerHint | null
}
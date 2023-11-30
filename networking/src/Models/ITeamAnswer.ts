import { ConfidenceLevel } from "../AWSMobileApi";
import { ITeamAnswerContent } from "./TeamAnswerClass";

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
}
import { ConfidenceLevel } from "../AWSMobileApi";
import { IAnswerContent } from "./AnswerClasses";

export interface ITeamAnswer {
    id: string,
    questionId: number
    isChosen: boolean
    text: string
    answerContent: IAnswerContent
    createdAt?: string
    updatedAt?: string
    teamMemberAnswersId?: string | null
    isTrickAnswer: boolean
    confidenceLevel: ConfidenceLevel
}
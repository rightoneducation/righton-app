import { ConfidenceLevel } from "../AWSMobileApi";
import { IAnswerContent } from "./IAnswerContent";

export interface ITeamAnswer {
    id: string,
    questionId: number
    isChosen: boolean
    text: string
    answerContents: IAnswerContent
    createdAt?: string
    updatedAt?: string
    teamMemberAnswersId?: string | null
    isTrickAnswer: boolean
    confidenceLevel: ConfidenceLevel
}
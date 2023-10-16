import { ConfidenceLevel } from "../AWSMobileApi";
import { ITeamAnswerContent } from "./ITeamAnswerContent";

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
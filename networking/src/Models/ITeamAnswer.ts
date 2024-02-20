import { ConfidenceLevel } from "../AWSMobileApi";
import { ITeamAnswerContent } from "./AnswerClasses";

export interface ITeamAnswer {
    id: string,
    questionId: string
    isChosen: boolean
    text: string
    answerContents: string
    createdAt: string
    updatedAt: string
    teamMemberAnswersId: string
    isTrickAnswer: boolean
    confidenceLevel: ConfidenceLevel
}
import { ConfidenceLevel } from "../AWSMobileApi";

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
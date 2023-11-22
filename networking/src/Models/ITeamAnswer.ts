import { ConfidenceLevel } from "../AWSMobileApi";

export interface ITeamAnswer {
    id: string,
    questionId: number
    isChosen: boolean
    text: string
    answerContents: string
    createdAt?: string
    updatedAt?: string
    teamMemberAnswersId?: string | null
    isTrickAnswer: boolean
    confidenceLevel: ConfidenceLevel
}
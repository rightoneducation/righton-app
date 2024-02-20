import { ConfidenceLevel } from "../../AWSMobileApi";

export type AWSTeamAnswer = {
  id: string
  questionId?: string | null
  isChosen: boolean
  isTrickAnswer: boolean
  text?: string | null
  awsAnswerContents?: string | null
  createdAt: string
  updatedAt: string
  teamMemberAnswersId?: string | null
  confidenceLevel: ConfidenceLevel
  __typename?: string | null
}
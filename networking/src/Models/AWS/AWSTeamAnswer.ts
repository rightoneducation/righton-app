export type AWSTeamAnswer = {
  id: string
  answer: string
  isSubmitted: boolean
  isShortAnswerEnabled: boolean
  currentState: string
  currentQuestionIndex: number
  questionId: string
  teamMemberAnswersId: string
  text?: string | null
  confidenceLevel?: string | null
  hint?: string | null
  createdAt: string
  updatedAt: string
  __typename?: string | null
}
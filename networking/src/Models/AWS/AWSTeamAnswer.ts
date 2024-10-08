export type AWSTeamAnswer = {
  id: string
  answer: string
  isSubmitted: boolean
  isShortAnswerEnabled: boolean
  currentState: string
  currentQuestionIndex: number
  questionId: string
  teamMemberAnswersId: string
  teamAnswersId?: string | null
  teamName?: string | null
  text?: string | null
  isCorrect?: boolean | null
  confidenceLevel?: string | null
  hint?: string | null
  createdAt: string
  updatedAt: string
  __typename?: string | null
}
export type AWSQuestion = {
  id: string
  text: string
  answerSettings: string
  hints: string
  choices?: string | null
  responses?: string | null
  imageUrl?: string | null
  instructions?: string | null
  standard?: string | null
  cluster?: string | null
  domain?: string | null
  grade?: string | null
  gameSessionId: string
  order: number
  isConfidenceEnabled: boolean
  isShortAnswerEnabled: boolean
  isHintEnabled: boolean
}

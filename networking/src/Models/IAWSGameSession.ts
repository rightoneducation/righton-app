import { GameSessionState } from "../AWSMobileApi"

export interface IAWSGameSession {
  id: string
  gameId: number
  startTime?: string | null
  phaseOneTime: number
  phaseTwoTime: number
  teams?: {
      items: Array<AWSTeam | null>
  } | null
  currentQuestionIndex?: number | null
  currentState: GameSessionState
  gameCode: number
  isAdvancedMode: boolean
  imageUrl?: string | null
  description?: string | null
  title?: string | null
  currentTimer?: number | null
  questions?: {
      items: Array<AWSQuestion | null>
  } | null
  createdAt: string
  updatedAt: string
}

type AWSTeam = {
  id: string
  name: string
  teamMembers?: {
      items: Array<AWSTeamMember | null>
  } | null
  score: number
  selectedAvatarIndex: number
  createdAt: string
  updatedAt?: string
  gameSessionTeamsId?: string | null
  teamQuestionId?: string | null
  teamQuestionGameSessionId?: string | null
}

type AWSQuestion = {
  id: string
  text: string
  choices?: string | null
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

type AWSTeamMember = {
  id: string
  isFacilitator?: boolean | null
  answers?: {
      items: Array<AWSTeamAnswer> | null
  } | null
  deviceId?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  teamTeamMembersId?: string | null
}

type AWSTeamAnswer = {
  id: string
  questionId?: string | null
  isChosen: boolean
  isTrickAnswer: boolean
  text?: string | null
  answerContents?: string | null
  createdAt?: string
  updatedAt?: string
  teamMemberAnswersId?: string | null
}
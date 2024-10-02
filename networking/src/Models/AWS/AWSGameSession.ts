import { AWSTeam } from "./AWSTeam";
import { AWSQuestion } from "./AWSQuestion";
import { GameSessionState } from "../../AWSMobileApi";

export type AWSGameSession = {
  id: string
  gameId: number
  startTime?: string | null
  phaseOneTime: number
  phaseTwoTime: number
  teams?: {
      items: Array<AWSTeam>
  } | null
  currentQuestionIndex?: number | null
  currentState: GameSessionState
  gameCode: number
  isAdvancedMode: boolean
  imageUrl?: string | null
  description?: string | null
  title?: string | null
  currentTimer?: number | null
  sessionData?: string | null
  questions?: {
      items: Array<AWSQuestion>
  } | null
  createdAt: string
  updatedAt: string
}
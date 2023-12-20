import { AWSTeamMember } from "./AWSTeamMember";

export type AWSTeam = {
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
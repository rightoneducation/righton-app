import { IQuestion } from "./IQuestion"
import { ITeamMember } from "./ITeamMember"

export interface ITeam {
    id: string
    name: string
    question?: IQuestion | null
    trickiestAnswerIDs?: Array<string | null> | null
    teamMembers?: Array<ITeamMember | null> | null
    score: number
    createdAt: string
    updatedAt: string
    gameSessionTeamsId?: string | null
    teamQuestionId?: string | null
    teamQuestionGameSessionId: string | null
}
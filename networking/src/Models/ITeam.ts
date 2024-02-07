import { IQuestion } from "./IQuestion"
import { ITeamMember } from "./ITeamMember"

export interface ITeam {
    id: string
    name: string
    question: IQuestion
    teamMembers: Array<ITeamMember> 
    score: number
    selectedAvatarIndex: number
    createdAt: string
    updatedAt: string
    gameSessionTeamsId: string
    teamQuestionId: string
    teamQuestionGameSessionId: string
}
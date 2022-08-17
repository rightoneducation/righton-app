import { ITeamAnswer } from "./ITeamAnswer"
import { ITeam } from "./ITeam"

export interface ITeamMember {
    id: string
    team: ITeam
    isFacilitator?: boolean | null
    answers?: Array<ITeamAnswer | null> | null
    deviceId: string
    createdAt: string
    updatedAt: string
    teamTeamMembersId?: string | null,
}
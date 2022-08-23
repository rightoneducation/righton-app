import { ITeamAnswer } from "./ITeamAnswer"

export interface ITeamMember {
    id: string
    isFacilitator?: boolean | null
    answers?: Array<ITeamAnswer | null> | null
    deviceId: string
    createdAt: string
    updatedAt: string
    teamTeamMembersId?: string | null,
}
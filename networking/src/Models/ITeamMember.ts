import { ITeamAnswer } from "./ITeamAnswer"

export interface ITeamMember {
    id: string
    isFacilitator?: boolean | null
    answers?: Array<ITeamAnswer | null> | null
    deviceId?: string | null
    createdAt?: string | null
    updatedAt?: string | null
    teamTeamMembersId?: string | null
}
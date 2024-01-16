import { ITeamAnswer } from "./ITeamAnswer"

export interface ITeamMember {
    id: string
    isFacilitator: boolean
    answers: Array<ITeamAnswer>
    deviceId: string
    createdAt: string
    updatedAt: string
    teamTeamMembersId: string
}
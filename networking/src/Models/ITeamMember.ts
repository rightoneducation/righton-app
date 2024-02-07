import { BackendAnswer } from "./AnswerClasses"

export interface ITeamMember {
    id: string
    isFacilitator?: boolean | null
    answers?: Array<BackendAnswer | null> | null
    deviceId?: string | null
    createdAt?: string | null
    updatedAt?: string | null
    teamTeamMembersId?: string | null
}
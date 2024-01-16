import { TeamAnswerClass } from "./AnswerClasses"

export interface ITeamMember {
    id: string
    isFacilitator?: boolean | null
    answers?: Array<TeamAnswerClass<any> | null> | null
    deviceId?: string | null
    createdAt?: string | null
    updatedAt?: string | null
    teamTeamMembersId?: string | null
}
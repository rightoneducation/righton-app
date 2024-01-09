import { BaseAnswer } from "./AnswerClasses"

export interface ITeamMember {
    id: string
    isFacilitator?: boolean | null
    answers?: Array<BaseAnswer<any> | null> | null
    deviceId?: string | null
    createdAt?: string | null
    updatedAt?: string | null
    teamTeamMembersId?: string | null
}
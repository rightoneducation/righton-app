import { NumberAnswer, StringAnswer, ExpressionAnswer } from "./TeamAnswerClass"

export interface ITeamMember {
    id: string
    isFacilitator?: boolean | null
    answers?: Array<NumberAnswer | StringAnswer| ExpressionAnswer | null> | null
    deviceId?: string | null
    createdAt?: string | null
    updatedAt?: string | null
    teamTeamMembersId?: string | null
}
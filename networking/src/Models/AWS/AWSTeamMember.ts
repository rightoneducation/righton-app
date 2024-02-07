import { AWSTeamAnswer } from "./AWSTeamAnswer";

export type AWSTeamMember = {
  id: string
  isFacilitator?: boolean | null
  answers?: {
    __typename?: string | null,
    items: Array<AWSTeamAnswer | null>,
    nextToken?: string | null,
  } | null
  deviceId?: string | null
  createdAt: string | null
  updatedAt: string | null
  teamTeamMembersId?: string | null
  __typename?: string | null
}
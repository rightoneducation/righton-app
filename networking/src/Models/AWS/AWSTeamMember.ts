import { AWSTeamAnswer } from "./AWSTeamAnswer";

export type AWSTeamMember = {
  id: string;
  isFacilitator?: boolean | null;
  answers?: {
    items: Array<AWSTeamAnswer | null> | null;
  } | null;
  deviceId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  teamTeamMembersId?: string | null;
};

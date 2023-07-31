import { ITeamAnswer } from "../ITeamAnswer";

export type AWSTeamMember = {
  id: string;
  isFacilitator?: boolean | null;
  answers?: {
    items: Array<ITeamAnswer> | null;
  } | null;
  deviceId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  teamTeamMembersId?: string | null;
};

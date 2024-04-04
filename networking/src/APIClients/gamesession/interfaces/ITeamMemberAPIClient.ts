import { ITeamMember } from "../../../Models";

export interface ITeamMemberAPIClient {
  addTeamMemberToTeam(
    teamId: string,
    isFacilitator: boolean,
    deviceId: string
  ): Promise<ITeamMember>;

  subscribeUpdateTeamMember(
    id: string,
    callback: (result: ITeamMember) => void
  ): Promise<any>;
}
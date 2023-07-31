import { ITeamMember } from "../Models";

export default interface ITeamMemberAPIClient {
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

import { ITeam } from "../../Models";
import { UpdateTeamInput } from "../../AWSMobileApi";

export interface ITeamAPIClient {
  getTeam(id: string): Promise<ITeam>;

  subscribeCreateTeam(
    id: string,
    callback: (result: ITeam) => void
  ): Promise<any>;

  updateTeam(teamInput: UpdateTeamInput): Promise<ITeam>;

  subscribeDeleteTeam(
    id: string,
    callback: (result: ITeam) => void
  ): Promise<any>;

  addTeamToGameSessionId(
    gameSessionId: string,
    name: string,
    questionId: string | null
  ): Promise<ITeam>;
}
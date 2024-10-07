import { Subscription } from 'rxjs'; // this is used in aws-amplify to handle subscriptions
import { ITeam } from "../../../Models";
import { UpdateTeamInput } from "../../../AWSMobileApi";

export interface ITeamAPIClient {
  getTeam(id: string): Promise<ITeam>;

  subscribeCreateTeam(
    id: string,
    callback: (result: ITeam) => void
  ): Subscription;

  subscribeUpdateTeam(
    id: string,
    callback: (result: ITeam) => void
  ): Subscription;

  updateTeam(teamInput: UpdateTeamInput): Promise<ITeam>;

  deleteTeam(teamId: string): Promise<ITeam>;

  subscribeDeleteTeam(
    id: string,
    callback: (result: ITeam) => void
  ): Subscription;

  addTeamToGameSessionId(
    gameSessionId: string,
    name: string,
    questionId: string | null,
    selectedAvatarIndex: number,
  ): Promise<ITeam>;
}
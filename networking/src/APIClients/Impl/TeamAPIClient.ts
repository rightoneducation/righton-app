import { TeamParser } from "../../Parsers";
import { ITeam } from "../../Models";
import {
  CreateTeamInput,
  CreateTeamMutation,
  CreateTeamMutationVariables,
  GetTeamQuery,
  GetTeamQueryVariables,
  OnCreateTeamSubscription,
  OnDeleteTeamSubscription,
  UpdateTeamInput,
  UpdateTeamMutation,
  UpdateTeamMutationVariables,
} from "../../GraphQLAPI";
import {
  createTeam,
  getTeam,
  onCreateTeam,
  onDeleteTeam,
  updateTeam,
} from "../../graphql";
import { ITeamAPIClient } from "../ITeamAPIClient";
import { BaseGraphQLAPIClient } from "./BaseGraphQLAPIClient";

export class TeamAPIClient
  extends BaseGraphQLAPIClient
  implements ITeamAPIClient
{
  async getTeam(id: string): Promise<ITeam> {
    let input: GetTeamQueryVariables = {
      id,
    };
    let result = await this.callGraphQLThrowOnError<GetTeamQuery>(
      getTeam,
      input
    );

    return TeamParser.teamFromAWSTeam(result.getTeam);
  }

  subscribeCreateTeam(id: string, callback: (result: ITeam) => void) {
    return this.subscribeGraphQL<OnCreateTeamSubscription>(
      {
        query: onCreateTeam,
        variables: {
          id: id,
        },
      },
      (value: OnCreateTeamSubscription) => {
        let team = TeamParser.teamFromCreateTeamSubscription(value);
        callback(team);
      }
    );
  }

  async updateTeam(teamInput: UpdateTeamInput): Promise<ITeam> {
    const input: UpdateTeamInput = teamInput;
    const variables: UpdateTeamMutationVariables = { input };
    const team = await this.callGraphQLThrowOnError<UpdateTeamMutation>(
      updateTeam,
      variables
    );
    return team.updateTeam as ITeam;
  }

  subscribeDeleteTeam(id: string, callback: (result: ITeam) => void) {
    return this.subscribeGraphQL<OnDeleteTeamSubscription>(
      {
        query: onDeleteTeam,
        variables: {
          id: id,
        },
      },
      (value: OnDeleteTeamSubscription) => {
        let team = TeamParser.teamFromDeleteTeamSubscription(value);
        callback(team);
      }
    );
  }

  async addTeamToGameSessionId(
    gameSessionId: string,
    name: string,
    questionId: string | null
  ): Promise<ITeam> {
    const input: CreateTeamInput = {
      name,
      score: 0,
      selectedAvatarIndex: 0,
      teamQuestionId: questionId,
      gameSessionTeamsId: gameSessionId,
      teamQuestionGameSessionId: gameSessionId,
    };
    const variables: CreateTeamMutationVariables = { input };
    const team = await this.callGraphQLThrowOnError<CreateTeamMutation>(
      createTeam,
      variables
    );
    return TeamParser.teamFromAWSTeam(team.createTeam);
  }
}

import { API, graphqlOperation } from "aws-amplify";
import { BaseAPIClient } from "./BaseAPIClient";
import { TeamParser } from "../Parsers/TeamParser";
import { AWSTeam, ITeam } from "../Models";
import {
  CreateTeamInput,
  CreateTeamMutation,
  CreateTeamMutationVariables,
  OnCreateTeamSubscription,
  OnDeleteTeamSubscription,
  UpdateTeamInput,
  UpdateTeamMutation,
  UpdateTeamMutationVariables,
} from "../AWSMobileApi";
import {
  getTeam,
  createTeam,
  onCreateTeam,
  onDeleteTeam,
  updateTeam,
} from "../graphql";
import { isNullOrUndefined } from "../global";
import { ITeamAPIClient } from "./interfaces/ITeamAPIClient";

export class TeamAPIClient
  extends BaseAPIClient
  implements ITeamAPIClient
{
  async getTeam(id: string): Promise<ITeam> {
    let result = (await API.graphql(
      graphqlOperation(getTeam, { id })
    )) as {
      data: any;
    };
    return TeamParser.teamFromAWSTeam(result.data.getTeam);
  }

  async updateTeam(
    teamInput: UpdateTeamInput
  ): Promise<ITeam> {
    const input: UpdateTeamInput = teamInput
    const variables: UpdateTeamMutationVariables = { input }
    const team = await this.callGraphQL<UpdateTeamMutation>(
        updateTeam,
        variables
    )
    if (
        isNullOrUndefined(team.data) ||
        isNullOrUndefined(team.data.updateTeam)
    ) {
        throw new Error(`Failed to update team`)
    }
    return TeamParser.teamFromAWSTeam(team.data.updateTeam) as ITeam
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
    }
    const variables: CreateTeamMutationVariables = { input }
    const team = await this.callGraphQL<CreateTeamMutation>(
        createTeam,
        variables
    )
    if (
        isNullOrUndefined(team.data) ||
        isNullOrUndefined(team.data.createTeam)
    ) {
        throw new Error(`Failed to create team`)
    }
    return TeamParser.teamFromAWSTeam(team.data.createTeam as AWSTeam)
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
        let team = this.mapOnCreateTeamSubscription(value);
        callback(team);
      }
    );
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
        let team = this.mapOnDeleteTeamSubscription(value);
        callback(team);
      }
    );
  }

  private mapOnCreateTeamSubscription(
    subscription: OnCreateTeamSubscription
  ): ITeam {
    return TeamParser.teamFromCreateTeamSubscription(subscription);
  }

  private mapOnDeleteTeamSubscription(
    subscription: OnDeleteTeamSubscription
  ): ITeam {
    return TeamParser.teamFromDeleteTeamSubscription(subscription);
  }
}
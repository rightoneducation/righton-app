import { BaseAPIClient, GraphQLOptions } from "../BaseAPIClient";
import { TeamParser } from "../../Parsers/TeamParser";
import { AWSTeam, ITeam } from "../../Models";
import {
  CreateTeamInput,
  DeleteTeamInput,
  CreateTeamMutation,
  CreateTeamMutationVariables,
  DeleteTeamMutationVariables,
  DeleteTeamMutation,
  OnTeamCreateByGameSessionIdSubscription,
  OnTeamUpdateByGameSessionIdSubscription,
  OnDeleteTeamSubscription,
  UpdateTeamInput,
  UpdateTeamMutation,
  UpdateTeamMutationVariables,
} from "../../AWSMobileApi";
import {
  getTeam,
  createTeam,
  deleteTeam,
  onTeamCreateByGameSessionId,
  onTeamUpdateByGameSessionId,
  onDeleteTeam,
  updateTeam,
} from "../../graphql";
import { isNullOrUndefined } from "../../global";
import { ITeamAPIClient } from "./interfaces/ITeamAPIClient";

export class TeamAPIClient
  extends BaseAPIClient
  implements ITeamAPIClient
{
  async getTeam(id: string): Promise<ITeam> {
    let result = (await this.callGraphQL(getTeam, { id } as unknown as GraphQLOptions)) as { data: any };
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
    questionId: string | null,
    selectedAvatarIndex: number,
  ): Promise<ITeam> {
    const input: CreateTeamInput = {
        name,
        score: 0,
        selectedAvatarIndex: selectedAvatarIndex,
        teamQuestionId: questionId,
        gameSessionTeamsId: gameSessionId,
        teamQuestionGameSessionId: gameSessionId,
    }
    const variables: CreateTeamMutationVariables = { input }
    console.log(variables);
    const team = await this.callGraphQL<CreateTeamMutation>(
        createTeam,
        variables
    )
    console.log(team);
    if (
        isNullOrUndefined(team.data) ||
        isNullOrUndefined(team.data.createTeam)
    ) {
        throw new Error(`Failed to create team`)
    }
    return TeamParser.teamFromAWSTeam(team.data.createTeam as AWSTeam)
  }


  async deleteTeam(
    teamId: string,
  ): Promise<ITeam> {
    const input: DeleteTeamInput = {
        id: teamId,
    }
    const variables: DeleteTeamMutationVariables = { input }
    const team = await this.callGraphQL<DeleteTeamMutation>(
        deleteTeam,
        variables
    )
    if (
        isNullOrUndefined(team.data) ||
        isNullOrUndefined(team.data.deleteTeam)
    ) {
        throw new Error(`Failed to delete team`)
    }
    return TeamParser.teamFromAWSTeam(team.data.deleteTeam as AWSTeam)
  }


  subscribeCreateTeam(id: string, callback: (result: ITeam) => void) {
    return this.subscribeGraphQL<OnTeamCreateByGameSessionIdSubscription>(
      {
        query: onTeamCreateByGameSessionId,
        variables: {
          gameSessionTeamsId: id,
        },
      },
      (value: OnTeamCreateByGameSessionIdSubscription) => {
        let team = this.mapOnCreateTeamSubscription(value);
        callback(team);
      }
    );
  }

  subscribeUpdateTeam(id: string, callback: (result: ITeam) => void) {
    return this.subscribeGraphQL<OnTeamUpdateByGameSessionIdSubscription>(
      {
        query: onTeamUpdateByGameSessionId,
        variables: {
          gameSessionTeamsId: id,
        },
      },
      (value: OnTeamUpdateByGameSessionIdSubscription) => {
        let team = this.mapOnUpdateTeamSubscription(value);
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
    subscription: OnTeamCreateByGameSessionIdSubscription
  ): ITeam {
    return TeamParser.teamFromCreateTeamSubscription(subscription);
  }

  private mapOnDeleteTeamSubscription(
    subscription: OnDeleteTeamSubscription
  ): ITeam {
    return TeamParser.teamFromDeleteTeamSubscription(subscription);
  }

  private mapOnUpdateTeamSubscription(
    subscription: OnTeamUpdateByGameSessionIdSubscription
  ): ITeam {
    return TeamParser.teamFromUpdateTeamSubscription(subscription);
  }
}
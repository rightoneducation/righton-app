import {
  CreateTeamMemberInput,
  CreateTeamMemberMutation,
  CreateTeamMemberMutationVariables,
  OnUpdateTeamMemberSubscription,
} from "../../GraphQLAPI";
import { ITeamMember } from "../../Models";
import { TeamMemberParser } from "../../Parsers";
import { createTeamMember, onUpdateTeamMember } from "../../graphql";
import { BaseGraphQLAPIClient } from "./BaseGraphQLAPIClient";

export class TeamMemberAPIClient extends BaseGraphQLAPIClient {
  async addTeamMemberToTeam(
    teamId: string,
    isFacilitator: boolean = false,
    deviceId: string
  ): Promise<ITeamMember> {
    const input: CreateTeamMemberInput = {
      isFacilitator,
      deviceId,
      teamTeamMembersId: teamId,
    };
    const variables: CreateTeamMemberMutationVariables = { input };
    const member = await this.callGraphQLThrowOnError<CreateTeamMemberMutation>(
      createTeamMember,
      variables
    );
    return TeamMemberParser.teamMemberFromAWSTeamMember(
      member.createTeamMember
    );
  }

  subscribeUpdateTeamMember(
    id: string,
    callback: (result: ITeamMember) => void
  ): Promise<any> {
    return this.subscribeGraphQL<OnUpdateTeamMemberSubscription>(
      {
        query: onUpdateTeamMember,
        variables: {
          id: id,
        },
      },
      (value: OnUpdateTeamMemberSubscription) => {
        let teamMember = this.mapOnUpdateTeamMemberSubscription(value);
        callback(teamMember);
      }
    );
  }

  private mapOnUpdateTeamMemberSubscription(
    subscription: OnUpdateTeamMemberSubscription
  ): ITeamMember {
    return TeamMemberParser.teamMemberFromTeamMemberSubscription(subscription);
  }
}

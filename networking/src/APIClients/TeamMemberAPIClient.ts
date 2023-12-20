import {
  CreateTeamMemberInput,
  CreateTeamMemberMutation,
  CreateTeamMemberMutationVariables,
  OnUpdateTeamMemberSubscription,
} from "../AWSMobileApi";
import { isNullOrUndefined } from "../IApiClient";
import { AWSTeamMember, ITeamMember } from "../Models";
import { TeamMemberParser } from "../Parsers/TeamMemberParser";
import { createTeamMember, onUpdateTeamMember } from "../graphql";
import { BaseAPIClient } from "./BaseAPIClient";

export default class TeamMemberAPIClient extends BaseAPIClient {
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
    const member = await this.callGraphQL<CreateTeamMemberMutation>(
      createTeamMember,
      variables
    );
    if (
      isNullOrUndefined(member.data) ||
      isNullOrUndefined(member.data.createTeamMember)
    ) {
      throw new Error(`Failed to create team member`);
    }
    return TeamMemberParser.teamMemberFromAWSTeamMember(
      member.data.createTeamMember as AWSTeamMember
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
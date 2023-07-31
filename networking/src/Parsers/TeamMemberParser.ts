import { OnUpdateTeamMemberSubscription } from "../GraphQLAPI";
import { isNullOrUndefined } from "../IApiClient";
import { AWSTeamMember, ITeamMember } from "../Models";
import { TeamAnswerParser } from "./TeamAnswerParser";

export class TeamMemberParser {
  static teamMemberFromTeamMemberSubscription(
    subscription: OnUpdateTeamMemberSubscription
  ): ITeamMember {
    const updateTeamMember = subscription.onUpdateTeamMember;
    if (isNullOrUndefined(updateTeamMember)) {
      throw new Error("subscription.onUpdateGameSession can't be null.");
    }
    //@ts-ignore
    return this.teamMemberFromAWSTeamMember(updateTeamMember);
  }

  static mapTeamMembers(
    awsTeamMembers: Array<AWSTeamMember | null> | null | undefined
  ): Array<ITeamMember> {
    if (isNullOrUndefined(awsTeamMembers)) {
      return [];
    }

    return awsTeamMembers.map((awsTeamMember) => {
      if (isNullOrUndefined(awsTeamMember)) {
        throw new Error("Team can't be null in the backend.");
      }
      return this.teamMemberFromAWSTeamMember(awsTeamMember);
    });
  }

  static teamMemberFromAWSTeamMember(
    awsTeamMember: AWSTeamMember
  ): ITeamMember {
    const {
      id,
      isFacilitator,
      answers,
      deviceId,
      createdAt,
      updatedAt,
      teamTeamMembersId,
    } = awsTeamMember || {};

    if (isNullOrUndefined(id) || isNullOrUndefined(teamTeamMembersId)) {
      throw new Error(
        "Team member has null field for the attributes that are not nullable"
      );
    }

    const teamMember: ITeamMember = {
      id,
      isFacilitator,
      answers: TeamAnswerParser.mapTeamAnswers(answers?.items),
      deviceId,
      createdAt,
      updatedAt,
      teamTeamMembersId,
    };
    return teamMember;
  }
}

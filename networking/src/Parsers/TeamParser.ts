import {
  OnCreateTeamSubscription,
  OnDeleteTeamSubscription,
} from "../GraphQLAPI";
import { isNullOrUndefined } from "../IApiClient";
import { AWSTeam, ITeam } from "../Models";
import { TeamMemberParser } from "./TeamMemberParser";

export class TeamParser {
  static teamFromCreateTeamSubscription(
    subscription: OnCreateTeamSubscription
  ): ITeam {
    const createTeam = subscription.onCreateTeam;
    if (isNullOrUndefined(createTeam)) {
      throw new Error(
        "subscription.teamFromCreateTeamSubscription can't be null."
      );
    }
    //@ts-ignore
    return this.teamFromAWSTeam(createTeam);
  }

  static teamFromDeleteTeamSubscription(
    subscription: OnDeleteTeamSubscription
  ): ITeam {
    const deleteTeam = subscription.onDeleteTeam;
    if (isNullOrUndefined(deleteTeam)) {
      throw new Error(
        "subscription.teamFromDeleteTeamSubscription can't be null."
      );
    }
    //@ts-ignore
    return this.teamFromAWSTeam(deleteTeam);
  }

  static teamFromAWSTeam(awsTeam?: AWSTeam | null): ITeam {
    if (isNullOrUndefined(awsTeam)) {
      throw new Error("awsTeam can't be null in the backend.");
    }

    const {
      id,
      name,
      teamMembers,
      score,
      selectedAvatarIndex,
      createdAt,
      updatedAt,
      gameSessionTeamsId,
      teamQuestionId,
      teamQuestionGameSessionId,
    } = awsTeam || {};

    if (isNullOrUndefined(id)) {
      throw new Error(
        "Team has null field for the attributes that are not nullable"
      );
    }

    const team: ITeam = {
      id,
      name,
      teamMembers: TeamMemberParser.mapTeamMembers(teamMembers?.items),
      score,
      selectedAvatarIndex,
      createdAt,
      updatedAt,
      gameSessionTeamsId,
      teamQuestionId,
      teamQuestionGameSessionId,
    };
    return team;
  }

  static teamsFromAWSTeams(
    awsTeams: { items: (AWSTeam | null)[] } | null | undefined
  ): Array<ITeam> {
    if (isNullOrUndefined(awsTeams) || isNullOrUndefined(awsTeams!.items)) {
      return [];
    }
    return awsTeams!.items.map((awsTeam) => {
      if (isNullOrUndefined(awsTeam)) {
        throw new Error("Team can't be null in the backend.");
      }

      const team: ITeam = {
        id: awsTeam.id,
        name: awsTeam.name,
        teamQuestionId: awsTeam.teamQuestionId,
        score: awsTeam.score,
        selectedAvatarIndex: awsTeam.selectedAvatarIndex,
        createdAt: awsTeam.createdAt,
        updatedAt: awsTeam.updatedAt,
        gameSessionTeamsId: awsTeam.gameSessionTeamsId,
        teamQuestionGameSessionId: awsTeam.teamQuestionGameSessionId,
        teamMembers: TeamMemberParser.mapTeamMembers(
          awsTeam.teamMembers?.items
        ),
      };
      return team;
    });
  }
}

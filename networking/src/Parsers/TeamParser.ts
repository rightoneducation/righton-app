import { isNullOrUndefined } from "../IApiClient";
import { ITeam } from "../Models";
import { AWSTeam } from "../Models/AWS";
import { 
  OnCreateTeamSubscription, 
  OnDeleteTeamSubscription 
} from "../AWSMobileApi";
import { TeamMemberParser } from "./TeamMemberParser"


export class TeamParser {
  static teamFromCreateTeamSubscription(
      subscription: OnCreateTeamSubscription
  ): ITeam {
      const createTeam = subscription.onCreateTeam
      if (isNullOrUndefined(createTeam)) {
          throw new Error(
              "subscription.teamFromCreateTeamSubscription can't be null."
          )
      }
      //@ts-ignore
      return this.teamFromAWSTeam(createTeam)
  }

  static teamFromDeleteTeamSubscription(
      subscription: OnDeleteTeamSubscription
  ): ITeam {
      const deleteTeam = subscription.onDeleteTeam
      if (isNullOrUndefined(deleteTeam)) {
          throw new Error(
              "subscription.teamFromDeleteTeamSubscription can't be null."
          )
      }
      //@ts-ignore
      return this.teamFromAWSTeam(deleteTeam)
  }

  static teamFromAWSTeam(awsTeam: AWSTeam): ITeam {
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
      } = awsTeam || {}

      if (isNullOrUndefined(id)) {
          throw new Error(
              "Team has null field for the attributes that are not nullable"
          )
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
      }
      return team
  }
}
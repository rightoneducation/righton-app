import { isNullOrUndefined } from "../IApiClient";
import { ITeam, ITeamMember } from "../Models";
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
        let teamMembers: ITeamMember[] = [];
        if (awsTeam.teamMembers?.items) {
            teamMembers = TeamMemberParser.mapTeamMembers(awsTeam.teamMembers?.items);
        }
        const {
            id,
            name,
            score = awsTeam.score ?? 0,
            selectedAvatarIndex = awsTeam.selectedAvatarIndex ?? 0,
            createdAt = awsTeam.createdAt ?? '',
            updatedAt = awsTeam.updatedAt ?? '',
            gameSessionTeamsId = awsTeam.gameSessionTeamsId ?? '',
            teamQuestionId = awsTeam.teamQuestionId ?? '',
            teamQuestionGameSessionId = awsTeam.teamQuestionGameSessionId ?? '',
        } = awsTeam || {}

        if (isNullOrUndefined(id)) {
            throw new Error(
                "Team has null field for the attributes that are not nullable"
            )
        }
        // using type assertion here because we've already provided default values for all nullable fields above
        const team: ITeam = {
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
        } as ITeam;
        return team
    }
}
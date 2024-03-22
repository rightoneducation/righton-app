import { isNullOrUndefined } from "../global";
import { ITeamMember, BackendAnswer } from "../Models";
import { AWSTeamMember } from "../Models/AWS";
import { OnUpdateTeamMemberSubscription } from "../AWSMobileApi";
import { TeamAnswerParser } from "./TeamAnswerParser"

export class TeamMemberParser {
    static teamMemberFromTeamMemberSubscription(
        subscription: OnUpdateTeamMemberSubscription
    ): ITeamMember {
        const updateTeamMember = subscription.onUpdateTeamMember
        if (isNullOrUndefined(updateTeamMember)) {
            throw new Error("subscription.onUpdateGameSession can't be null.")
        }
        //@ts-ignore
        return this.teamMemberFromAWSTeamMember(updateTeamMember)
    }

    static mapTeamMembers(
        awsTeamMembers: Array<AWSTeamMember | null> | null | undefined
    ): Array<ITeamMember> {
        if (isNullOrUndefined(awsTeamMembers)) {
            return []
        }
        return awsTeamMembers.map((awsTeamMember) => {
            if (isNullOrUndefined(awsTeamMember)) {
                throw new Error("Team can't be null in the backend.")
            }
            return this.teamMemberFromAWSTeamMember(awsTeamMember)
        })
    }

    static teamMemberFromAWSTeamMember(
        awsTeamMember: AWSTeamMember
    ): ITeamMember {
        let answers: BackendAnswer[] = [];
        if (!isNullOrUndefined(awsTeamMember.answers?.items)) {
            answers = TeamAnswerParser.mapTeamAnswers(awsTeamMember.answers?.items)
        }
        const {
            id,
            isFacilitator = awsTeamMember.isFacilitator ?? false,
            deviceId = awsTeamMember.deviceId ?? '',
            createdAt = awsTeamMember.createdAt ?? '',
            updatedAt = awsTeamMember.updatedAt ?? '',
            teamTeamMembersId = awsTeamMember.teamTeamMembersId ?? '',
        } = awsTeamMember || {}

        if (isNullOrUndefined(id)) {
            throw new Error(
                "Team member has null field for the attributes that are not nullable"
            )
        }
        // using type assertion here because we've already provided default values for all nullable fields above
        const teamMember: ITeamMember = {
            id,
            isFacilitator,
            answers,
            deviceId,
            createdAt,
            updatedAt,
            teamTeamMembersId,
        } as ITeamMember;
        return teamMember
    }
}
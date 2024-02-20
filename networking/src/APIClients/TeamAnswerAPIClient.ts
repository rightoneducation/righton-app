import {
  ConfidenceLevel,
  CreateTeamAnswerInput,
  CreateTeamAnswerMutation,
  CreateTeamAnswerMutationVariables,
  OnCreateTeamAnswerSubscription,
  OnUpdateTeamAnswerSubscription,
  UpdateTeamAnswerInput,
  UpdateTeamAnswerMutation,
  UpdateTeamAnswerMutationVariables,
} from "../AWSMobileApi";
import { isNullOrUndefined } from "../global";
import { ITeamAnswer } from "../Models";
import { TeamAnswerParser } from "../Parsers/TeamAnswerParser";
import {
  createTeamAnswer,
  onCreateTeamAnswer,
  onUpdateTeamAnswer,
  updateTeamAnswer,
} from "../graphql";
import { BaseAPIClient } from "./BaseAPIClient";
import { ITeamAnswerAPIClient } from "./interfaces/ITeamAnswerAPIClient";

export class TeamAnswerAPIClient
  extends BaseAPIClient
  implements ITeamAnswerAPIClient
{
  
  async addTeamAnswer(
    teamMemberId: string,
    questionId: string,
    text: string,
    answerContents: string,
    isChosen: boolean = false,
    isTrickAnswer: boolean = false
  ): Promise<ITeamAnswer> {
    const awsAnswerContents = JSON.stringify(answerContents)
    const input: CreateTeamAnswerInput = {
        questionId,
        isChosen,
        isTrickAnswer,
        text, // leaving this in to prevent breaking current build, will be removed when answerContents is finalized
        awsAnswerContents, 
        teamMemberAnswersId: teamMemberId,
        confidenceLevel: ConfidenceLevel.NOT_RATED
    }
    const variables: CreateTeamAnswerMutationVariables = { input }
    const answer = await this.callGraphQL<CreateTeamAnswerMutation>(
        createTeamAnswer,
        variables
    )
    if (
        isNullOrUndefined(answer.data) ||
        isNullOrUndefined(answer.data.createTeamAnswer)
    ) {
        throw new Error(`Failed to create team answer`)
    }
    return TeamAnswerParser.teamAnswerFromAWSTeamAnswer(answer.data.createTeamAnswer) as ITeamAnswer
  }

  async updateTeamAnswer(
    teamAnswerId: string,
    isChosen: boolean | null = null,
    confidenceLevel: ConfidenceLevel
  ): Promise<ITeamAnswer> {
    const input: UpdateTeamAnswerInput = {
        id: teamAnswerId,
        isChosen,
        confidenceLevel
    }
    const variables: UpdateTeamAnswerMutationVariables = { input }
    const answer = await this.callGraphQL<UpdateTeamAnswerMutation>(
        updateTeamAnswer,
        variables
    )
    if (
        isNullOrUndefined(answer.data) ||
        isNullOrUndefined(answer.data.updateTeamAnswer)
    ) {
        throw new Error(`Failed to update team answer`)
    }
    return TeamAnswerParser.teamAnswerFromAWSTeamAnswer(answer.data.updateTeamAnswer) as ITeamAnswer
  }

  subscribeCreateTeamAnswer(
    id: string,
    callback: (result: ITeamAnswer) => void
  ) {
    return this.subscribeGraphQL<OnCreateTeamAnswerSubscription>(
        {
            query: onCreateTeamAnswer,
            variables: {
                id: id,
            },
        },
        (value: OnCreateTeamAnswerSubscription) => {
            let teamAnswer = this.mapOnCreateTeamAnswerSubscription(value)
            callback(teamAnswer)
        }
    )
  }

  subscribeUpdateTeamAnswer(
      id: string,
      callback: (result: ITeamAnswer) => void
  ) {
      return this.subscribeGraphQL<OnUpdateTeamAnswerSubscription>(
          {
              query: onUpdateTeamAnswer,
              variables: {
                  id: id,
              },
          },
          (value: OnUpdateTeamAnswerSubscription) => {
              let teamAnswer = this.mapOnUpdateTeamAnswerSubscription(value)
              callback(teamAnswer)
          }
      )
  }

  private mapOnCreateTeamAnswerSubscription(
    subscription: OnCreateTeamAnswerSubscription
  ): ITeamAnswer {
    return TeamAnswerParser.teamAnswerFromCreateTeamAnswerSubscription(
        subscription
    )
  }

  private mapOnUpdateTeamAnswerSubscription(
    subscription: OnUpdateTeamAnswerSubscription
  ): ITeamAnswer {
    return TeamAnswerParser.teamAnswerFromUpdateTeamAnswerSubscription(
        subscription
    )
  }
}
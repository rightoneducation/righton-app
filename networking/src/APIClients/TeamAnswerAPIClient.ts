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
import { BackendAnswer, IAnswerHint } from "../Models";
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
      inputAnswer: BackendAnswer
  ): Promise<BackendAnswer> {
      if (isNullOrUndefined(inputAnswer) ||
          isNullOrUndefined(inputAnswer.questionId) ||
          isNullOrUndefined(inputAnswer.text) 
      ) {
          throw new Error(`Missing required answer attributes`);
      }
      const input: CreateTeamAnswerInput = {
          answer: JSON.stringify(inputAnswer.answer), 
          isSubmitted: inputAnswer.isSubmitted,
          isShortAnswerEnabled: inputAnswer.isShortAnswerEnabled,
          currentState: inputAnswer.currentState,
          currentQuestionIndex: inputAnswer.currentQuestionIndex,
          questionId: inputAnswer.questionId,
          teamMemberAnswersId: inputAnswer.teamMemberAnswersId,
          text: inputAnswer.text, // leaving this in to prevent breaking current build, will be removed when answerContents is finalized
          confidenceLevel: ConfidenceLevel.NOT_RATED,
          hint: JSON.stringify(inputAnswer.hint)
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
      return TeamAnswerParser.teamAnswerFromAWSTeamAnswer(answer.data.createTeamAnswer) as BackendAnswer
  }
  async updateTeamAnswerBase(
    input: UpdateTeamAnswerInput
  ): Promise<BackendAnswer> {
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
    return TeamAnswerParser.teamAnswerFromAWSTeamAnswer(answer.data.updateTeamAnswer) as BackendAnswer
  }
  async updateTeamAnswer(
    teamAnswerId: string,
    confidenceLevel: ConfidenceLevel
  ): Promise<BackendAnswer> {
    const input: UpdateTeamAnswerInput = {
        id: teamAnswerId,
        confidenceLevel
    }
    return this.updateTeamAnswerBase(input);
  }
  
  async updateTeamAnswerConfidence(
    teamAnswerId: string,
    confidenceLevel?: ConfidenceLevel
  ): Promise<BackendAnswer> {
    const input: UpdateTeamAnswerInput = {
        id: teamAnswerId,
        confidenceLevel
    }
  return this.updateTeamAnswerBase(input);
  }

  async updateTeamAnswerHint(
    teamAnswerId: string,
    hint: IAnswerHint
  ): Promise<BackendAnswer> {
    const awsHint = JSON.stringify(hint)
    const input: UpdateTeamAnswerInput = {
        id: teamAnswerId,
        hint: awsHint
    }
    return this.updateTeamAnswerBase(input);
  }

  subscribeCreateTeamAnswer(
    id: string,
    callback: (result: BackendAnswer) => void
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
      callback: (result: BackendAnswer) => void
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
  ): BackendAnswer {
    return TeamAnswerParser.teamAnswerFromCreateTeamAnswerSubscription(
        subscription
    )
  }

  private mapOnUpdateTeamAnswerSubscription(
    subscription: OnUpdateTeamAnswerSubscription
  ): BackendAnswer {
    return TeamAnswerParser.teamAnswerFromUpdateTeamAnswerSubscription(
        subscription
    )
  }
}
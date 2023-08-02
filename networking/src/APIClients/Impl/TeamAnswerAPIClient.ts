import {
  ConfidenceLevel,
  CreateTeamAnswerInput,
  CreateTeamAnswerMutation,
  CreateTeamAnswerMutationVariables,
  OnCreateTeamAnswerSubscription,
  UpdateTeamAnswerInput,
  UpdateTeamAnswerMutation,
  UpdateTeamAnswerMutationVariables,
} from "../../GraphQLAPI";
import { isNullOrUndefined } from "../../IApiClient";
import { ITeamAnswer } from "../../Models";
import { TeamAnswerParser } from "../../Parsers";
import {
  createTeamAnswer,
  onCreateTeamAnswer,
  updateTeamAnswer,
} from "../../graphql";
import { BaseAPIClient } from "./BaseAPIClient";
import { ITeamAnswerAPIClient } from "../ITeamAnswerAPIClient";

export class TeamAnswerAPIClient
  extends BaseAPIClient
  implements ITeamAnswerAPIClient
{
  subscribeCreateTeamAnswer(
    id: string,
    callback: (result: ITeamAnswer) => void
  ): Promise<any> {
    return this.subscribeGraphQL<OnCreateTeamAnswerSubscription>(
      {
        query: onCreateTeamAnswer,
        variables: {
          id: id,
        },
      },
      (value: OnCreateTeamAnswerSubscription) => {
        let teamAnswer = this.mapOnCreateTeamAnswerSubscription(value);
        callback(teamAnswer);
      }
    );
  }

  async addTeamAnswer(
    teamMemberId: string,
    questionId: string,
    text: string,
    isChosen: boolean = false,
    isTrickAnswer: boolean = false
  ): Promise<ITeamAnswer> {
    const input: CreateTeamAnswerInput = {
      questionId,
      isChosen,
      isTrickAnswer,
      text,
      teamMemberAnswersId: teamMemberId,
      confidenceLevel: ConfidenceLevel.NOT_RATED,
    };
    const variables: CreateTeamAnswerMutationVariables = { input };
    const answer = await this.callGraphQL<CreateTeamAnswerMutation>(
      createTeamAnswer,
      variables
    );
    if (
      isNullOrUndefined(answer.data) ||
      isNullOrUndefined(answer.data.createTeamAnswer)
    ) {
      throw new Error(`Failed to create team answer`);
    }
    return answer.data.createTeamAnswer as ITeamAnswer;
  }

  async updateTeamAnswer(
    teamAnswerId: string,
    isChosen: boolean | null = null
  ): Promise<ITeamAnswer> {
    const input: UpdateTeamAnswerInput = {
      id: teamAnswerId,
      isChosen,
    };
    const variables: UpdateTeamAnswerMutationVariables = { input };
    const answer = await this.callGraphQL<UpdateTeamAnswerMutation>(
      updateTeamAnswer,
      variables
    );
    if (
      isNullOrUndefined(answer.data) ||
      isNullOrUndefined(answer.data.updateTeamAnswer)
    ) {
      throw new Error(`Failed to update team answer`);
    }
    return answer.data.updateTeamAnswer as ITeamAnswer;
  }

  private mapOnCreateTeamAnswerSubscription(
    subscription: OnCreateTeamAnswerSubscription
  ): ITeamAnswer {
    return TeamAnswerParser.teamAnswerFromTeamAnswerSubscription(subscription);
  }
}

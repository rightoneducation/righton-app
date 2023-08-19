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
import { ITeamAnswer } from "../../Models";
import { TeamAnswerParser } from "../../Parsers";
import {
  createTeamAnswer,
  onCreateTeamAnswer,
  updateTeamAnswer,
} from "../../graphql";
import { ITeamAnswerAPIClient } from "../ITeamAnswerAPIClient";
import { BaseGraphQLAPIClient } from "./BaseGraphQLAPIClient";

export class TeamAnswerAPIClient
  extends BaseGraphQLAPIClient
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
        let teamAnswer =
          TeamAnswerParser.teamAnswerFromTeamAnswerSubscription(value);
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
    const answer = await this.callGraphQLThrowOnError<CreateTeamAnswerMutation>(
      createTeamAnswer,
      variables
    );

    return TeamAnswerParser.teamAnswerFromAWSTeamAnswer(
      answer.createTeamAnswer
    );
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
    const answer = await this.callGraphQLThrowOnError<UpdateTeamAnswerMutation>(
      updateTeamAnswer,
      variables
    );

    return TeamAnswerParser.teamAnswerFromAWSTeamAnswer(
      answer.updateTeamAnswer
    );
  }
}

import { OnCreateTeamAnswerSubscription } from "../GraphQLAPI";
import { isNullOrUndefined } from "../IApiClient";
import { ITeamAnswer, AWSTeamAnswer } from "../Models";
import { onCreateTeamAnswer } from "../graphql";

export class TeamAnswerParser {
  static teamAnswerFromTeamAnswerSubscription(
    subscription: OnCreateTeamAnswerSubscription
  ): ITeamAnswer {
    const createTeamAnswer = subscription.onCreateTeamAnswer;
    if (isNullOrUndefined(onCreateTeamAnswer)) {
      throw new Error("subscription.onCreateTeamAnswer can't be null.");
    }
    //@ts-ignore
    return this.teamAnswerFromAWSTeamAnswer(createTeamAnswer);
  }

  static mapTeamAnswers(
    awsTeamAnswers: Array<AWSTeamAnswer | null> | null | undefined
  ): Array<ITeamAnswer> {
    if (isNullOrUndefined(awsTeamAnswers)) {
      return [];
    }

    return awsTeamAnswers.map((awsTeamAnswer) => {
      if (isNullOrUndefined(awsTeamAnswer)) {
        throw new Error("Team can't be null in the backend.");
      }
      return this.teamAnswerFromAWSTeamAnswer(awsTeamAnswer);
    });
  }

  static teamAnswerFromAWSTeamAnswer(
    awsTeamAnswer?: AWSTeamAnswer | null
  ): ITeamAnswer {
    if (isNullOrUndefined(awsTeamAnswer)) {
      throw new Error("awsTeamAnswer can't be null in the backend.");
    }

    const {
      id,
      questionId,
      isChosen,
      isTrickAnswer,
      text,
      createdAt,
      updatedAt,
      teamMemberAnswersId,
      confidenceLevel,
    } = awsTeamAnswer || {};

    if (
      isNullOrUndefined(id) ||
      isNullOrUndefined(teamMemberAnswersId) ||
      isNullOrUndefined(questionId) ||
      isNullOrUndefined(text)
    ) {
      throw new Error(
        "Team answer has null field for the attributes that are not nullable"
      );
    }

    const teamAnswer: ITeamAnswer = {
      id,
      questionId,
      isChosen,
      isTrickAnswer,
      text,
      createdAt,
      updatedAt,
      teamMemberAnswersId,
      confidenceLevel,
    };
    return teamAnswer;
  }
}

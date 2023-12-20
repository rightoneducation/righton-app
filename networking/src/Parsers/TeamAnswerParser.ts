import { isNullOrUndefined } from "../IApiClient";
import { ITeamAnswer } from "../Models";
import { AWSTeamAnswer } from "../Models/AWS";
import { 
  OnCreateTeamAnswerSubscription, 
  OnUpdateTeamAnswerSubscription 
} from "../AWSMobileApi";


export class TeamAnswerParser {
  static teamAnswerFromCreateTeamAnswerSubscription(
      subscription: OnCreateTeamAnswerSubscription
  ): ITeamAnswer {
      const createTeamAnswer = subscription.onCreateTeamAnswer
      if (isNullOrUndefined(createTeamAnswer)) {
          throw new Error("subscription.onCreateTeamAnswer can't be null.")
      }
      return this.teamAnswerFromAWSTeamAnswer(createTeamAnswer)
  }

  static teamAnswerFromUpdateTeamAnswerSubscription(
      subscription: OnUpdateTeamAnswerSubscription
  ): ITeamAnswer {
      const updateTeamAnswer = subscription.onUpdateTeamAnswer
      if (isNullOrUndefined(updateTeamAnswer)) {
          throw new Error("subscription.onCreateTeamAnswer can't be null.")
      }
      return this.teamAnswerFromAWSTeamAnswer(updateTeamAnswer)
  }

  static mapTeamAnswers(
      awsTeamAnswers: Array<AWSTeamAnswer | null> | null | undefined
  ): Array<ITeamAnswer> {
      if (isNullOrUndefined(awsTeamAnswers)) {
          return []
      }

      return awsTeamAnswers.map((awsTeamAnswer) => {
          if (isNullOrUndefined(awsTeamAnswer)) {
              throw new Error("Team can't be null in the backend.")
          }
          return this.teamAnswerFromAWSTeamAnswer(awsTeamAnswer)
      })
  }

  static teamAnswerFromAWSTeamAnswer(
      awsTeamAnswer: AWSTeamAnswer
  ): ITeamAnswer {
      const {
          id,
          questionId,
          isChosen,
          isTrickAnswer,
          text,
          awsAnswerContents,
          createdAt,
          updatedAt,
          teamMemberAnswersId,
          confidenceLevel
      } = awsTeamAnswer || {}

      if (isNullOrUndefined(id) ||
          isNullOrUndefined(teamMemberAnswersId) ||
          isNullOrUndefined(questionId) ||
          isNullOrUndefined(text) ||
          isNullOrUndefined(awsAnswerContents)) {
          throw new Error(
              "Team answer has null field for the attributes that are not nullable"
          )
      }

      const teamAnswer: ITeamAnswer = {
          id,
          questionId,
          isChosen,
          isTrickAnswer,
          text,
          answerContents: awsAnswerContents,
          createdAt,
          updatedAt,
          teamMemberAnswersId,
          confidenceLevel
      }
      return teamAnswer
  }
}
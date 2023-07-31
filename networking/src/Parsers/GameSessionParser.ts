import { isNullOrUndefined } from "../IApiClient";
import {
  OnGameSessionUpdatedByIdSubscription,
  OnUpdateGameSessionSubscription,
  UpdateGameSessionMutation,
} from "../GraphQLAPI";
import { IGameSession, AWSGameSession } from "../Models/";
import { TeamParser } from "./TeamParser";
import QuestionParser from "./QuestionParser";

export class GameSessionParser {
  static gameSessionFromSubscription(
    subscription: OnUpdateGameSessionSubscription
  ): IGameSession {
    const updateGameSession = subscription.onUpdateGameSession;
    if (isNullOrUndefined(updateGameSession)) {
      throw new Error("subscription.onUpdateGameSession can't be null.");
    }
    //@ts-ignore
    return this.gameSessionFromAWSGameSession(updateGameSession);
  }

  static gameSessionFromMutation(mutation: UpdateGameSessionMutation) {
    const updateGameSession = mutation.updateGameSession;
    if (isNullOrUndefined(updateGameSession)) {
      throw new Error("mutation.updateGameSession can't be null.");
    }
    //@ts-ignore
    return this.gameSessionFromAWSGameSession(updateGameSession);
  }

  static gameSessionFromAWSGameSession(
    awsGameSession: AWSGameSession
  ): IGameSession {
    const {
      id,
      gameId,
      startTime,
      phaseOneTime,
      phaseTwoTime,
      teams,
      currentQuestionIndex,
      currentState,
      gameCode,
      questions,
      currentTimer,
      updatedAt,
      createdAt,
      title,
      isAdvancedMode,
    } = awsGameSession || {};
    if (
      isNullOrUndefined(id) ||
      isNullOrUndefined(currentState) ||
      isNullOrUndefined(gameCode) ||
      isNullOrUndefined(gameId) ||
      isNullOrUndefined(phaseOneTime) ||
      isNullOrUndefined(phaseTwoTime) ||
      isNullOrUndefined(questions) ||
      isNullOrUndefined(questions.items) ||
      isNullOrUndefined(updatedAt) ||
      isNullOrUndefined(createdAt) ||
      isNullOrUndefined(isAdvancedMode)
    ) {
      throw new Error(
        "GameSession has null field for the attributes that are not nullable"
      );
    }

    const gameSession: IGameSession = {
      id,
      gameId,
      startTime,
      phaseOneTime,
      phaseTwoTime,
      teams: TeamParser.teamsFromAWSTeams(teams),
      currentQuestionIndex,
      currentState,
      gameCode,
      currentTimer,
      questions: QuestionParser.questionsFromAWSQuestions(questions.items),
      isAdvancedMode,
      updatedAt,
      createdAt,
      title,
    };
    return gameSession;
  }

  static gameSessionFromSubscriptionById(
    subscription: OnGameSessionUpdatedByIdSubscription
  ): IGameSession {
    const updateGameSession = subscription.onGameSessionUpdatedById;
    if (isNullOrUndefined(updateGameSession)) {
      throw new Error("subscription.onUpdateGameSession can't be null.");
    }
    //@ts-ignore
    return this.gameSessionFromAWSGameSession(updateGameSession);
  }
}

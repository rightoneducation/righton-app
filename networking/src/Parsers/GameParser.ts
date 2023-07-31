import { isNullOrUndefined } from "../IApiClient";
import { AWSGame, IGame } from "../Models";
import { ListGamesQuery } from "../GraphQLAPI";
import QuestionParser from "./QuestionParser";

export abstract class GameParser {
  static gamesFromAWSGames(
    listGamesQuery: ListGamesQuery | null | undefined
  ): Array<IGame> {
    const listGames = listGamesQuery?.listGames?.items;
    if (isNullOrUndefined(listGames)) {
      throw new Error("fetching list of games failed.");
    }
    return listGames.map((awsGame) => {
      return this.gameFromAWSGame(awsGame);
    });
  }

  static gameFromAWSGame(awsGame: AWSGame | null | undefined): IGame {
    if (isNullOrUndefined(awsGame) || isNullOrUndefined(awsGame.title)) {
      throw new Error("awsGame can't be null.");
    }

    const {
      id,
      title,
      description,
      phaseOneTime,
      phaseTwoTime,
      imageUrl,
      questions,
      updatedAt,
      createdAt,
    } = awsGame;

    return {
      id,
      title,
      description,
      phaseOneTime,
      phaseTwoTime,
      imageUrl,
      questions: QuestionParser.questionsFromAWSGameQuestions(questions?.items),
      updatedAt,
      createdAt,
    };
  }
}

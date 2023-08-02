import { describe } from "node:test";
import { expect, test, beforeAll } from "@jest/globals";
import { randomUUID } from "node:crypto";
import {
  IGame,
  GameQuestionAPIClient,
  IGameQuestionAPIClient,
  Environment,
  GameAPIClient,
  IGameAPIClient,
} from "../../src";

describe("Testing GameAPIClient", async () => {
  let gameQuestionAPIClient: IGameQuestionAPIClient = new GameQuestionAPIClient(
    Environment.Local
  );
  let gameAPIClient: IGameAPIClient = new GameAPIClient(Environment.Local);

  let questionId = randomUUID();
  let game: IGame;
  beforeAll(async () => {
    game = await gameAPIClient.createGame({
      id: randomUUID(),
      title: "test",
      description: "test",
      phaseOneTime: 10,
      phaseTwoTime: 10,
      imageUrl: "test",
    });
    expect(game).toBeDefined();
  });

  test("create game question", async () => {
    let choices = [{ text: "answer", reason: "reason", isAnswer: true }];
    let instructions = ["instruction1", "instruction2"];
    let gameQuestion = await gameQuestionAPIClient.createGameQuestion({
      id: questionId,
      text: "test",
      choices: JSON.stringify(choices),
      imageUrl: "imageUrl",
      instructions: JSON.stringify(instructions),
      cluster: "cluster",
      domain: "domain",
      grade: "grade",
      standard: "standard",
      gameId: game.id,
    });

    expect(gameQuestion.id).toEqual(questionId);
    expect(gameQuestion.gameId).toEqual(game.id);
  });

  test("delete game question", async () => {
    let gameQuestion = await gameQuestionAPIClient.deleteQuestion({
      id: questionId,
      gameId: game.id,
    });
    expect(gameQuestion.id).toEqual(questionId);
    expect(gameQuestion.gameId).toEqual(game.id);
  });
});

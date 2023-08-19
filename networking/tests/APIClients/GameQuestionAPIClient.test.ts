import { describe } from "node:test";
import { expect, test } from "@jest/globals";
import { randomUUID } from "node:crypto";
import {
  GameQuestionAPIClient,
  IGameQuestionAPIClient,
  Environment,
} from "../../src";

describe("Testing GameAPIClient", async () => {
  let gameQuestionAPIClient: IGameQuestionAPIClient = new GameQuestionAPIClient(
    Environment.Local
  );

  let questionId = randomUUID();

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
    });

    expect(gameQuestion.id).toEqual(questionId);
  });

  test("delete game question", async () => {
    let gameQuestion = await gameQuestionAPIClient.deleteQuestion(questionId);
    expect(gameQuestion.id).toEqual(questionId);
  });
});

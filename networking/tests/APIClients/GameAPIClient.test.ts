import { Environment, IGameAPIClient, GameAPIClient } from "../../src";
import { describe } from "node:test";
import { expect, test } from "@jest/globals";
import { randomUUID } from "node:crypto";

describe("Testing GameAPIClient", async () => {
  let gameAPIClient: IGameAPIClient = new GameAPIClient(Environment.Local);
  let gameId = randomUUID();
  test("create game", async () => {
    let game = await gameAPIClient.createGame({
      id: gameId,
      title: "test",
      description: "test",
      phaseOneTime: 10,
      phaseTwoTime: 10,
      imageUrl: "test",
    });
    expect(game.id).not.toBeNull();
  });

  test("update game", async () => {
    let updatedTitle = "updatedTitle";
    let game = await gameAPIClient.updateGame({
      id: gameId,
      title: updatedTitle,
    });
    expect(game.title).toEqual(updatedTitle);
  });

  test("get game", async () => {
    let game = await gameAPIClient.getGame(gameId);
    expect(game.id).toEqual(gameId);
  });

  test("list games", async () => {
    let games = await gameAPIClient.listGames();
    expect(games.length).toBeGreaterThan(0);
  });

  test("clone game", async () => {
    let game = await gameAPIClient.getGame(gameId);
    let clonedGame = await gameAPIClient.clone(game);
    expect(clonedGame.id).not.toEqual(game.id);
  });

  test("delete game", async () => {
    let deletedGame = await gameAPIClient.deleteGame(gameId);
    expect(deletedGame.id).toEqual(gameId);
  });
});

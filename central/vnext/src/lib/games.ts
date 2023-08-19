import {
  IGame,
  Environment,
  GameAPIClient,
  IGameAPIClient,
  CreateGameInput,
  IGameQuestion
} from '@righton/networking';
import { SORT_TYPES, sortGamesBySortType } from './sorting';
import { v4 as uuidv4 } from 'uuid';

let gameAPIClient: IGameAPIClient = new GameAPIClient(Environment.Local);
export const fetchGames = async (
  sortType: SORT_TYPES = SORT_TYPES.UPDATED
): Promise<Array<IGame>> => {
  return gameAPIClient.listGames();
};

export const sortGames = (
  games: Array<IGame>,
  sortType: SORT_TYPES = SORT_TYPES.UPDATED
) => {
  return sortGamesBySortType(games, sortType);
};

export const createGame = async (createGameInput: CreateGameInput) => {
  return gameAPIClient.createGame(createGameInput);
};

export const updateGame = async (game: IGame) => {
  return gameAPIClient.updateGameByGame(game);
};

// @ts-ignore
export const cloneGame = async (game: any) => {
  return gameAPIClient.clone(game);
};

export const deleteGames = async (id: string) => {
  return gameAPIClient.deleteGame(id);
};

export const deleteQuestion = async (questionId: string, game: IGame) => {
  game.questions = game.questions.filter(
    question => question.id !== questionId
  );
  await gameAPIClient.updateGameByGame(game);
};

export const getGameById = (games: IGame[], id: string) => {
  return games.find(game => game.id === id);
};

export const fetchGameById = (id: string) => {
  return gameAPIClient.getGame(id);
};

export const updateQuestion = (question: IGameQuestion, game: IGame) => {
  const index = game.questions.findIndex(q => q.id === question.id);
  game.questions[index] = question;
  return gameAPIClient.updateGameByGame(game);
};

export const cloneQuestion = (question: IGameQuestion) => {
  return {
    id: uuidv4(),
    text: question.text,
    choices: question.choices,
    imageUrl: question.imageUrl,
    instructions: question.instructions,
    standard: question.standard,
    cluster: question.cluster,
    domain: question.domain,
    grade: question.grade
  };
};

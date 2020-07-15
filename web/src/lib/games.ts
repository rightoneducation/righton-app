import { API, graphqlOperation } from 'aws-amplify';
import { ListGamesQuery, CreateGamesInput, CreateGamesMutation, UpdateGamesInput, UpdateGamesMutation, DeleteGamesMutation } from '../API';
import { listGames } from '../graphql/queries';
import { createGames, updateGames, deleteGames } from '../graphql/mutations';
import { Game, Question, APIGame } from '../types';

const deserializeQuestion = (question: string | null) => {
  return question === null ? question : (JSON.parse(question) as Question);
}

const deserializeQuestions = (game: APIGame | null): Game | null => {
  if (game === null) return null;
  return {
    ...game,
    q1: deserializeQuestion(game.q1),
    q2: deserializeQuestion(game.q2),
    q3: deserializeQuestion(game.q3),
    q4: deserializeQuestion(game.q4),
    q5: deserializeQuestion(game.q5),
  }
}

const serializeQuestion = (question: Question | null) => {
  if (question !== null) {
    // @ts-ignore
    Object.keys(question).forEach((key) => { if (question[key] === '') question[key] = null; });
  }
  return question === null ? question : JSON.stringify(question);
}

const serializeQuestions = (game: Game): APIGame | null => {
  if (game === null) return null;
  return {
    ...game,
    q1: serializeQuestion(game.q1),
    q2: serializeQuestion(game.q2),
    q3: serializeQuestion(game.q3),
    q4: serializeQuestion(game.q4),
    q5: serializeQuestion(game.q5),
  }
}

const sortByUpdated = (a: APIGame, b: APIGame) => {
  if (a.updated === null) return 1;
  if (b.updated === null) return -1;
  if (a.updated > b.updated) return -1;
  if (b.updated > a.updated) return 1;
  return 0;
};

export const fetchGames = async () => {
  const result = await API.graphql(graphqlOperation(listGames)) as { data: ListGamesQuery };
  const games = (result?.data?.listGames?.items || []) as APIGame[];
  return games.sort(sortByUpdated).map(deserializeQuestions);
}

export const createGame = async (game: CreateGamesInput) => {
  // @ts-ignore
  Object.keys(game).forEach((key) => { if (game[key] === '') game[key] = null; });
  const input = {
    ...game,
    updated: Date.now()// Add current timestamp
  };
  const result = await API.graphql(graphqlOperation(createGames, { input })) as { data: CreateGamesMutation };
  return result?.data?.createGames;
}

// @ts-ignore
export const duplicateGame = async (game) => {
  const input = serializeQuestions(game);
  const result = await API.graphql(graphqlOperation(createGames, { input })) as { data: CreateGamesMutation };
  return result?.data?.createGames;
}

export const updateGame = async (game: Game) => {
  const input = serializeQuestions(game) as UpdateGamesInput;
  input.updated = Date.now(); // Add current timestamp
  // @ts-ignore
  Object.keys(input).forEach((key) => { if (input[key] === '') input[key] = null; });
  const result = await API.graphql(graphqlOperation(updateGames, { input })) as { data: UpdateGamesMutation };
  return result?.data?.updateGames;
}

export const deleteGame = async (id: number): Promise<APIGame | null> => {
  const input = { GameID: id };
  const result = await API.graphql(graphqlOperation(deleteGames, { input })) as { data: DeleteGamesMutation };
  return result?.data?.deleteGames;
}

export const getGameImage = (game: Game) => {
  for (let i = 1; i < 6; i++) {
    // @ts-ignore
    if (game[`q${i}`]?.image) return game[`q${i}`]?.image;
  }
  return null;
}
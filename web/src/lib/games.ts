import { API, graphqlOperation } from 'aws-amplify';
import { ListGamesQuery, CreateGamesInput, CreateGamesMutation, UpdateGamesInput, UpdateGamesMutation } from '../API';
import { listGames } from '../graphql/queries';
import { createGames, updateGames } from '../graphql/mutations';
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

export const fetchGames = async () => {
  const result = await API.graphql(graphqlOperation(listGames)) as { data: ListGamesQuery };
  const games = result?.data?.listGames?.items || [];
  return games.map(deserializeQuestions);
}

export const createGame = async (game: CreateGamesInput) => {
  // @ts-ignore
  Object.keys(game).forEach((key) => { if (game[key] === '') game[key] = null; });
  const result = await API.graphql(graphqlOperation(createGames, { input: game })) as { data: CreateGamesMutation };
  return result?.data?.createGames;
}

export const updateGame = async (game: Game) => {
  const input = serializeQuestions(game) as UpdateGamesInput;
  // @ts-ignore
  Object.keys(game).forEach((key) => { if (game[key] === '') game[key] = null; });
  const result = await API.graphql(graphqlOperation(updateGames, { input })) as { data: UpdateGamesMutation };
  return result?.data?.updateGames;
}
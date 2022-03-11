import { API, graphqlOperation } from 'aws-amplify';
import { Game, ListGamesQuery, DeleteGameMutation, DeleteQuestionMutation } from '../API';
import { listGames, getGame as GG } from '../graphql/queries';
import { createGame as CG, updateGame as UG, createGameQuestion as CGQ, deleteGame, deleteQuestion } from '../graphql/mutations';
import { SORT_TYPES, sortGamesBySortType } from './sorting';

export const fetchGames = async (sortType: SORT_TYPES = SORT_TYPES.UPDATED): Promise<Array<Game | null>> => {
  const result = await API.graphql(graphqlOperation(listGames)) as { data: ListGamesQuery | null | undefined };
  const games = result?.data?.listGames || [];
  return games;
}

export const sortGames = (games: Array<Game | null>, sortType: SORT_TYPES = SORT_TYPES.UPDATED) => {
  return sortGamesBySortType(games, sortType);
};

export const createGame = async (game: any, questionIDSet: any) => {
  const newGame = await API.graphql(graphqlOperation(CG, { game })) as { data: any };
  const newGameId = newGame?.data?.createGame?.id;
  let result = {data: {createGameQuestion: null}};
  for (let i = 0; i < questionIDSet.length; i++) {
    result = await API.graphql(graphqlOperation(CGQ, { gameQuestion : { gameId: newGameId, questionId: questionIDSet[i] } })) as { data: any };
  }
  return newGame?.data?.createGame;
};

export const updateGame = async (game: any) => { 
  const editGame = await API.graphql(graphqlOperation(UG, { game })) as { data: any };
  return editGame?.data?.updateGame || [];
};

// @ts-ignore
export const cloneGame = async (game: any) => { 
  const questions = game.questions;
  delete game.questions;
  const newGame = await API.graphql(graphqlOperation(CG, { game })) as { data: any };
  const newGameId = newGame?.data?.createGame?.id;
  let result = {data: {createGameQuestion: null}};
  for (let i = 0; i < questions.length; i++) {
    result = await API.graphql(graphqlOperation(CGQ, { gameQuestion : { gameId: newGameId, questionId: questions[i].id } })) as { data: any };
  }
  return newGame?.data?.createGame;
};

export const deleteGames = async (id: number) => { 
  const result = await API.graphql(graphqlOperation(deleteGame, {id})) as { data: DeleteGameMutation | null | undefined }
  return result?.data?.deleteGame || [];
};

export const deleteQuestions = async (id: number) => { 
  const result = await API.graphql(graphqlOperation(deleteQuestion, {id})) as { data: DeleteQuestionMutation | null | undefined }
  return result?.data?.deleteQuestion || [];
};

export const getGame = async (id: any) => {
  const result = await API.graphql(graphqlOperation(GG, { id })) as { data: any };
  return result.data;
};

export const getGameById = (games: Game[], id: number | string) => {
  const numericalId = Number(id);
  return games.find((game) => game.id === numericalId)
}

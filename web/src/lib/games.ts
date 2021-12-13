import { API, graphqlOperation } from 'aws-amplify';
import { Game, ListGamesQuery } from '../API';
import { listGames } from '../graphql/queries';
import { createGame as CG, updateGame as UG, createGameQuestion as CGQ } from '../graphql/mutations';
import { SORT_TYPES, sortGamesBySortType } from './sorting';

export const fetchGames = async (sortType: SORT_TYPES = SORT_TYPES.UPDATED): Promise<Array<Game | null>> => {
  const result = await API.graphql(graphqlOperation(listGames)) as { data: ListGamesQuery | null | undefined };
  const games = result?.data?.listGames || [];
  return games;
}

export const sortGames = (games: Array<Game | null>, sortType: SORT_TYPES = SORT_TYPES.UPDATED) => {
  return sortGamesBySortType(games, sortType);
};

export const createGame = async (game: any) => {
  const result = await API.graphql(graphqlOperation(CG, { game })) as { data: any };
  return result?.data?.createGame;
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

export const updateGame = async (game: any) => { 
  const result = await API.graphql(graphqlOperation(UG, { game })) as { data: any };
  return result?.data?.updateGame || [];
 };

export const deleteGame = async (game: any) => { };
// TODO: replace this old implementation
// 
// async (id: number): Promise<APIGame | null> => {
//   const input = { GameID: id };
//   const result = await API.graphql(graphqlOperation(deleteGames, { input })) as { data: DeleteGamesMutation };
//   return result?.data?.deleteGames;
// }

export const getGameImage = (game: Game) => {
  // TODO: replace this old implementation
  // 
  // for (let i = 1; i < 6; i++) {
  //   if (game?.questions[i]?.image) return game?.questions[i]?.image;
  // }
  return null;
}

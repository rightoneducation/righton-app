import { API, graphqlOperation } from 'aws-amplify';
import { Game, ListGamesQuery } from '../API';
import { listGames } from '../graphql/queries';
import { SORT_TYPES, sortGamesBySortType } from './sorting';

export const fetchGames = async (sortType: SORT_TYPES = SORT_TYPES.UPDATED): Promise<Array<Game | null>> => {
  const result: { data: ListGamesQuery } = await API.graphql(graphqlOperation(listGames));
  const games = result?.data?.listGames || [];
  return games;
}

export const sortGames = (games: Array<Game | null>, sortType: SORT_TYPES = SORT_TYPES.UPDATED) => {
  return sortGamesBySortType(games, sortType);
};

export const createGame = async (game: any) => { };
// TODO: replace this old implementation
// 
// (game: CreateGamesInput) => {
//   // @ts-ignore
//   Object.keys(game).forEach((key) => { if (game[key] === '') game[key] = null; });
//   const input = {
//     ...game,
//     updated: Date.now() // Add current timestamp
//   };
//   const result = await API.graphql(graphqlOperation(createGames, { input })) as { data: CreateGamesMutation };
//   return result?.data?.createGames;
// }

// @ts-ignore
export const cloneGame = async (game: any) => { };
// TODO: replace this old implementation
// 
// async (game) => {
//   const input = serializeQuestions(game);
//   const result = await API.graphql(graphqlOperation(createGames, { input })) as { data: CreateGamesMutation };
//   return result?.data?.createGames;
// }

export const updateGame = async (game: any) => { };
// TODO: replace this old implementation
// 
// async (game: Game) => {
//   const input = serializeQuestions(game) as UpdateGamesInput;
//   input.updated = Date.now(); // Add current timestamp
//   // @ts-ignore
//   Object.keys(input).forEach((key) => { if (input[key] === '') input[key] = null; });
//   const result = await API.graphql(graphqlOperation(updateGames, { input })) as { data: UpdateGamesMutation };
//   return result?.data?.updateGames;
// }

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
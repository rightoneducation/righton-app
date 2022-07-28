import { API, graphqlOperation } from 'aws-amplify';
<<<<<<< HEAD
import { Game, ListGamesQuery, DeleteGameMutation, DeleteQuestionMutation } from '../API';
import { listGames, getGame as GG } from '../graphql/queries';
import { createGame as CG, updateGame as UG, createGameQuestion as CGQ, deleteGame as DG, deleteQuestion } from '../graphql/mutations';
=======
import { Game, ListGamesQuery } from '../API';
import { listGames } from '../graphql/queries';
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
import { SORT_TYPES, sortGamesBySortType } from './sorting';

export const fetchGames = async (sortType: SORT_TYPES = SORT_TYPES.UPDATED): Promise<Array<Game | null>> => {
  const result = await API.graphql(graphqlOperation(listGames)) as { data: ListGamesQuery | null | undefined };
  const games = result?.data?.listGames || [];
  return games;
}

export const sortGames = (games: Array<Game | null>, sortType: SORT_TYPES = SORT_TYPES.UPDATED) => {
  return sortGamesBySortType(games, sortType);
};

<<<<<<< HEAD
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
  const result = await API.graphql(graphqlOperation(DG, {id})) as { data: DeleteGameMutation | null | undefined }
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
=======
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
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864

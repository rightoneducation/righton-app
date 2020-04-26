// TODO: create create game method
// TODO: create save game method
import { API, graphqlOperation } from 'aws-amplify';
import { ListGamesQuery } from '../API';
import { listGames } from '../graphql/queries';
import { Game, Question } from '../types';

const deserializeQuestion = (question: string | null) => {
  return question === null ? question : (JSON.parse(question) as Question);
}

export const fetchGames = async (cb: (games: Game[]) => void) => {
  const result = await API.graphql(graphqlOperation(listGames)) as { data: ListGamesQuery };
  const games = result?.data?.listGames?.items || [];
  cb(
    // @ts-ignore
    games.map(
      (game) => {
        if (game === null) return null;
        return {
          ...game,
          q1: deserializeQuestion(game.q1),
          q2: deserializeQuestion(game.q2),
          q3: deserializeQuestion(game.q3),
          q4: deserializeQuestion(game.q4),
          q5: deserializeQuestion(game.q5),
        };
      }
    )
  );
}
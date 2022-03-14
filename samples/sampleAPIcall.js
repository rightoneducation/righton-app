import { listGameSessions, getGameSession } from "./queries";
import { API, graphqlOperation } from 'aws-amplify';

export const listGS = async () => {
  const result = await API.graphql(graphqlOperation(listGameSessions));
  const games = result?.data?.listGameSessions || [];
  return games;
}

export const getGS = async (id) => {
  const result = await API.graphql(graphqlOperation(getGameSession, { id }));
  const game = result?.data?.getGameSession || {};
  return game;
}

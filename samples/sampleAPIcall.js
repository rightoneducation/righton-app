import { getGameSession } from "./queries";
import { API, graphqlOperation } from 'aws-amplify';

export const getGameSession = async () => {
  const result = await API.graphql(graphqlOperation(getGameSession));
  const games = result?.data?.getGameSession || [];
  return games;
}

import { API } from 'aws-amplify';
import debug from '../../../src/utils/debug';


async function getGamesFromDynamoDB(onSuccess, onError) {
  try {
    const apiName = 'GamesAPI';
    const path = '/items';
    const response = await API.get(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error getting GameRoom from DynamoDB:', exception);
  }
}


async function getCategoryFromDynamoDB(category, onSuccess, onError) {
  try {
    const apiName = 'GamesAPI';
    const path = `/items/${category}`;
    const response = await API.get(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error getting GameRoom from DynamoDB:', exception);
  }
}


export {
  getGamesFromDynamoDB,
  getCategoryFromDynamoDB,
};

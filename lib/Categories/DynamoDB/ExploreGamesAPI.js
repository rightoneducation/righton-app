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

// TODO! Deprecated API - switched from category to CCS elements
// On a closer look, is it really deprecated because category is just
// an argument descriptor for a column in Games..
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

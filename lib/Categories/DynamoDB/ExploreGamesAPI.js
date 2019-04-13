import { API } from 'aws-amplify';
import debug from '../../../src/utils/debug';


async function getInitialGamesFromDynamoDB(onSuccess, onError) {
  try {
    const apiName = 'GamesAPI';
    const path = '/items';
    const response = await API.get(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error getting initial Games from DynamoDB:', exception);
  }
}


async function getAdditionalGamesFromDynamoDB(onSuccess, onError, LastEvaluatedKey) {
  try {
    const apiName = 'GamesAPI';
    const path = `/items/${JSON.stringify(LastEvaluatedKey)}`;
    const response = await API.get(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error getting additional Games from DynamoDB:', exception);
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
    debug.log('Error getting Category from Games:', exception);
  }
}


export {
  getAdditionalGamesFromDynamoDB,
  getInitialGamesFromDynamoDB,
  getCategoryFromDynamoDB,
};

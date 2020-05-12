import { API } from 'aws-amplify';
import debug from '../../../src/utils/debug';


async function putQuizInDynamoDB(quiz, onSuccess, onError) {
  try {
    const apiName = 'QuizMakerAPI';
    const path = '/GameID';
    const myInit = {
      body: {
        ...quiz,
      },
      headers: {},
    };
    const response = await API.put(apiName, path, myInit);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error putting GameRoom into DynamoDB:', exception);
  }
}


async function getQuizFromDynamoDB(GameID, onSuccess, onError) {
  try {
    const apiName = 'QuizMakerAPI';
    const path = `/GameID/object/${GameID}`;
    const response = await API.get(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error getting GameRoom from DynamoDB:', exception);
  }
}


export {
  putQuizInDynamoDB,
  getQuizFromDynamoDB,
};

import { API } from 'aws-amplify';
import debug from '../../../src/utils/debug';


async function putGameToDynamoDB(GameRoomID, username, onSuccess, onError) {
  try {
    const apiName = 'TeacherGameAPI';
    const path = '/GameRoomID';
    const date = Date.now();
    const myInit = {
      body: {
        GameRoomID,
        date,
        username,
      },
      headers: {},
    };
    const response = await API.put(apiName, path, myInit);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error putting awsQuiz into DynamoDB:', exception);
  }
}


async function getGameFromDynamoDB(GameRoomID, onSuccess, onError) {
  try {
    const apiName = 'TeacherGameAPI';
    const path = `/GameRoomID/object/${GameRoomID}`;
    const response = await API.get(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error getting GameRoom from DynamoDB:', exception);
  }
}


async function deleteGameFromDynamoDB(GameRoomID, onSuccess, onError) {
  try {
    const apiName = 'TeacherGameAPI';
    const path = `/GameRoomID/object/${GameRoomID}`;
    const response = await API.del(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error deleting GameRoom from DynamoDB:', exception);
  }
}


export {
  deleteGameFromDynamoDB,
  getGameFromDynamoDB,
  putGameToDynamoDB,
};

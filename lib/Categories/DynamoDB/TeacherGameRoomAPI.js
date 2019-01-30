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
    debug.log('Error putting GameRoom into DynamoDB:', exception);
  }
}


function generateUniqueID() {
  const coinFlip = Math.floor(Math.random() * 2);
  let randomID = '';
  if (coinFlip === 0) {
    randomID = `${Math.ceil(Math.random() * 9)}${Math.floor(Math.random() * 10)}${Math.ceil(Math.random() * 9)}${Math.floor(Math.random() * 10)}`;
  } else {
    randomID = `${Math.ceil(Math.random() * 9)}${Math.ceil(Math.random() * 9)}${Math.floor(Math.random() * 10)}${Math.ceil(Math.random() * 9)}`;
  }
  return randomID;
}


function generateUniqueGameRoomIDInDynamoDB(onSuccess, onError) {
  try {
    const randomID = generateUniqueID();
    getGameFromDynamoDB(randomID,
      (res) => {
        debug.log('Response from GETting newly generated random ID from DynamoDB:', JSON.stringify(res));
        if (Object.keys(res).length === 0) {
          onSuccess(randomID);
        } else {
          debug.log('Retrying a different generated random ID because previous one already exists in DynamoDB:', JSON.stringify(res));
          generateUniqueGameRoomIDInDynamoDB(onSuccess, onError);
        }
      },
      (exception) => {
        debug.log('Error getting GameRoom from DynamoDB:', exception);
      }
    );
  } catch (exception) {
    debug.log('Error generating unique game room ID in DynamoDB', JSON.stringify(exception));
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
  generateUniqueGameRoomIDInDynamoDB,
  getGameFromDynamoDB,
  putGameToDynamoDB,
};

import { API } from 'aws-amplify';


function putGameToDynamoDB(GameRoomID) {
  try {
    const apiName = 'TeacherGameAPI';
    const path = '/GameRoomID';
    const date = Date.now();
    const myInit = {
      body: {
        GameRoomID,
        date,
      },
      headers: {},
    };

    API.put(apiName, path, myInit).then((response) => {
      console.log('Response from posting quiz: ', response);
    }).catch((error) => {
      console.log('Error from posting quiz:', error);
    });
  } catch (exception) {
    console.log('Error putting awsQuiz into DynamoDB:', exception);
  }
}


function deleteGameFromDynamoDB(GameRoomID) {
  try {
    const apiName = 'TeacherGameAPI';
    const path = '/GameRoomID';
    const myInit = {
      params: {
        GameRoomID,
      },
      headers: {},
    };

    API.delete(apiName, path, myInit).then((response) => {
      console.log('Response from deleting quiz: ', response);
    }).catch((error) => {
      console.log('Error from deleting quiz:', error);
    });
  } catch (exception) {
    console.log('Error putting awsQuiz into DynamoDB:', exception);
  }
}


export default {
  deleteGameFromDynamoDB,
  putGameToDynamoDB,
};

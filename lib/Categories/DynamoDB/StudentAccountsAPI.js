import { API } from 'aws-amplify';
import debug from '../../../src/utils/debug';


async function putStudentAccountToDynamoDB(account, onSuccess, onError) {
  try {
    const apiName = 'StudentAccountsAPI';
    const path = '/StudentID';
    const myInit = {
      body: {
        ...account,
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


async function getStudentAccountFromDynamoDB(account, onSuccess, onError) {
  try {
    const apiName = 'StudentAccountsAPI';
    const path = `/StudentID/object/${account.StudentID}`;
    const response = await API.get(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error getting GameRoom from DynamoDB:', exception);
  }
}


async function deleteStudentAccountFromDynamoDB(account, onSuccess, onError) {
  try {
    const apiName = 'StudentAccountsAPI';
    const path = `/StudentID/object/${account.StudentID}`;
    const response = await API.del(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error deleting GameRoom from DynamoDB:', exception);
  }
}


export {
  putStudentAccountToDynamoDB,
  getStudentAccountFromDynamoDB,
  deleteStudentAccountFromDynamoDB,
};

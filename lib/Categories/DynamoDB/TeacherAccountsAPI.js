import { API } from 'aws-amplify';
import debug from '../../../src/utils/debug';


async function putTeacherAccountToDynamoDB(account, onSuccess, onError) {
  try {
    const apiName = 'TeacherAccountsAPI';
    const path = '/TeacherID';
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


async function getTeacherAccountFromDynamoDB(account, onSuccess, onError) {
  try {
    const apiName = 'TeacherAccountsAPI';
    const path = `/TeacherID/object/${account.TeacherID}`;
    const response = await API.get(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error getting GameRoom from DynamoDB:', exception);
  }
}


async function deleteTeacherAccountFromDynamoDB(account, onSuccess, onError) {
  try {
    const apiName = 'TeacherAccountsAPI';
    const path = `/TeacherID/object/${account.TeacherID}`;
    const response = await API.del(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error deleting GameRoom from DynamoDB:', exception);
  }
}


export {
  putTeacherAccountToDynamoDB,
  getTeacherAccountFromDynamoDB,
  deleteTeacherAccountFromDynamoDB,
};

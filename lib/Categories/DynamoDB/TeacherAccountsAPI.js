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


async function getTeacherAccountFromDynamoDB(TeacherID, onSuccess, onError) {
  try {
    const apiName = 'TeacherAccountsAPI';
    const path = `/TeacherID/object/${TeacherID}`;
    const response = await API.get(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error getting GameRoom from DynamoDB:', exception);
  }
}


async function deleteTeacherAccountFromDynamoDB(TeacherID, onSuccess, onError) {
  try {
    const apiName = 'TeacherAccountsAPI';
    const path = `/TeacherID/object/${TeacherID}`;
    const response = await API.del(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error deleting GameRoom in DynamoDB:', exception);
  }
}


async function putTeacherItemInDynamoDB(apiName, TeacherID, items, onSuccess, onError) {
  try {
    const path = '/TeacherID';
    const myInit = {
      body: {
        TeacherID,
        ...items,
      },
      headers: {},
    };
    const response = await API.put(apiName, path, myInit);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error putting Teacher item into DynamoDB:', exception);
  }
}


async function getTeacherItemFromDynamoDB(apiName, TeacherID, onSuccess, onError) {
  try {
    const path = `/TeacherID/object/${TeacherID}`;
    const response = await API.get(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error getting Teacher item from DynamoDB:', exception);
  }
}


async function deleteTeacherItemInDynamoDB(apiName, TeacherID, onSuccess, onError) {
  try {
    const path = `/TeacherID/object/${TeacherID}`;
    const response = await API.del(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error deleting Teacher item in DynamoDB:', exception);
  }
}


export {
  putTeacherAccountToDynamoDB,
  getTeacherAccountFromDynamoDB,
  deleteTeacherAccountFromDynamoDB,

  putTeacherItemInDynamoDB,
  getTeacherItemFromDynamoDB,
  deleteTeacherItemInDynamoDB,
};

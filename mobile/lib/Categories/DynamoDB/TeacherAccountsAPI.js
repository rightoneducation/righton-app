import { API } from 'aws-amplify';
import debug from '../../../src/utils/debug';


async function putTeacherAccountToDynamoDB(account, onSuccess, onError) {
  try {
    const apiName = 'TeacherAccountsAPI';
    const path = '/TeacherID';
    const myInit = {
      body: {
        Item: { ...account },
      },
      headers: {},
    };
    const response = await API.put(apiName, path, myInit);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error putting Teacher Account into DynamoDB:', exception);
  }
}


async function updateTeacherGamesInTeacherAccountInDynamoDB(
  TeacherID, games, onSuccess, onError
) {
  if (!Array.isArray(games)) {
    debug.warn('Updating Teacher Games cannot be a null or undefined value');
    return;
  }
  try {
    const apiName = 'TeacherAccountsAPI';
    const path = '/TeacherID/games';
    const myInit = {
      body: {
        Key: {
          TeacherID,
        },
        UpdateExpression: 'SET games = :g',
        ExpressionAttributeValues: {
          ':g': games,
        },
      },
      headers: {},
    };
    const response = await API.put(apiName, path, myInit);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error putting Teacher games item into DynamoDB:', exception);
  }
}

async function updateTeacherSharedGamesInTeacherAccountInDynamoDB(
  TeacherID, sharedGames, onSuccess, onError
) {
  if (!Array.isArray(sharedGames)) {
    debug.warn('Updating Teacher sharedGames cannot be a null or undefined value');
    return;
  }
  try {
    const apiName = 'TeacherAccountsAPI';
    const path = '/TeacherID/sharedGames';
    const myInit = {
      body: {
        Key: {
          TeacherID,
        },
        UpdateExpression: 'SET sharedGames = :s',
        ExpressionAttributeValues: {
          ':s': sharedGames,
        },
      },
      headers: {},
    };
    const response = await API.put(apiName, path, myInit);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error putting Teacher sharedGames item into DynamoDB:', exception);
  }
}

async function updateTeacherHistoryInTeacherAccountInDynamoDB(
  TeacherID, history, onSuccess, onError
) {
  if (!Array.isArray(history)) {
    debug.warn('Updating Teacher History cannot be a null or undefined value');
    return;
  }
  try {
    const apiName = 'TeacherAccountsAPI';
    const path = '/TeacherID/history';
    const myInit = {
      body: {
        Key: {
          TeacherID,
        },
        UpdateExpression: 'SET history = :h',
        ExpressionAttributeValues: {
          ':h': history,
        },
      },
      headers: {},
    };
    const response = await API.put(apiName, path, myInit);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error putting Teacher history item into DynamoDB:', exception);
  }
}


async function getItemFromTeacherAccountFromDynamoDB(TeacherID, attributes = '', onSuccess, onError) {
  try {
    const apiName = 'TeacherAccountsAPI';
    let path = `/TeacherID/${TeacherID}`;
    switch (attributes) {
      case 'games':
        path += '/games';
        break;
      case 'history':
        path += '/history';
        break;
      case 'sharedGames':
        path += '/sharedGames';
        break;
      default:
        // By default, only 'TeacherID, gamesCreated, gamesPlayed, schoolID, gamesRef, historyRef'
        // are returned if not specifically getting games or history.
        break;
    }
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
    const path = `/TeacherID/${TeacherID}`;
    const response = await API.del(apiName, path);
    onSuccess(response);
  } catch (exception) {
    onError(exception);
    debug.log('Error deleting Teacher Accountin DynamoDB:', exception);
  }
}


async function shareGameWithTeacher(otherTeacherID, game, onSuccess, onError) {
  getItemFromTeacherAccountFromDynamoDB(
    otherTeacherID,
    'sharedGames',
    (res) => {
      const { sharedGames } = res;
      console.log('GOT shared games:', sharedGames);
      if (Array.isArray(sharedGames)) {
        sharedGames.unshift(game);
        updateTeacherSharedGamesInTeacherAccountInDynamoDB(
          otherTeacherID,
          sharedGames,
          () => onSuccess(true),
          (exception => onError(exception))
        );
      }
    },
    exception => onError(exception)
  );
}


export {
  putTeacherAccountToDynamoDB,
  updateTeacherGamesInTeacherAccountInDynamoDB,
  updateTeacherHistoryInTeacherAccountInDynamoDB,
  getItemFromTeacherAccountFromDynamoDB,
  deleteTeacherAccountFromDynamoDB,
  shareGameWithTeacher,
};

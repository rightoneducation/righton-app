/* eslint no-param-reassign: 0 */
import debug from '../../../src/utils/debug';

export default function (message, context) {
  const data = message.value.msg;
  const { uid } = data;

  if (context.messagesReceived[uid]) return;

  context.messagesReceived[uid] = true;

  const { gameState } = context.state;
  const { action, payload } = data;
  switch (action) {
    case 'SET_GAME_STATE': {
      if (typeof gameState === 'object' && Object.keys(gameState).length === 0) {
        if (typeof payload === 'object' && Object.keys(payload).length > 0) {
          context.handleSetAppState('gameState', payload);
        } else if (context.requestAttempts < 9) {
          // Sometimes payload is empty for whatever odd reason.
          // Retry when this occurs.
          const requestMessage = {
            action: 'REQUEST_GAME_STATE',
            uid: `${Math.random()}`,
          };
          context.IOTPublishMessage(requestMessage);
          context.requestAttempts += 1;
        } else {
          context.requestAttempts = 0;
        }
        debug.log('SET_GAME_STATE action with payload:', JSON.stringify(payload));
      }
      break;
    }
    case 'START_GAME': {
      const updatedGameState = { ...gameState, state: payload };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('START_GAME action with payload:', JSON.stringify(payload));
      break;
    }
    case 'PUSH_TEAM_TRICK': {
      const { team } = context.state;
      const { teamRef } = data;
      const ref = parseInt(teamRef.substr(teamRef.indexOf('m') + 1), 10);
      if (team !== ref) return;

      const updatedGameState = { ...gameState };
      updatedGameState[teamRef].tricks.push(payload);
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('PUSH_TEAM_TRICK action with payload:', JSON.stringify(payload));
      break;
    }
    case 'UPDATE_TEAM_TRICK': {
      const { team } = context.state;
      const { teamRef } = data;
      const ref = parseInt(teamRef.substr(teamRef.indexOf('m') + 1), 10);
      if (team !== ref) return;

      const updatedGameState = { ...gameState };
      const { index } = data;
      updatedGameState[teamRef].tricks[index].selected = payload;
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('UPDATE_TEAM_TRICK action with payload:', JSON.stringify(payload));
      break;
    }
    case 'SET_TEAM_CHOICES': {
      const updatedGameState = { ...gameState };
      const { teamRef } = data;
      updatedGameState[teamRef].choices = payload;
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('SET_TEAM_CHOICES action with payload:', JSON.stringify(payload));
      break;
    }
    case 'START_QUIZ': {
      const updatedGameState = { ...gameState, state: payload };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('START_QUIZ action with payload:', JSON.stringify(payload));
      break;
    }
    case 'END_QUIZ': {
      const updatedGameState = { ...gameState, state: payload };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('END_QUIZ action with payload:', JSON.stringify(payload));
      break;
    }
    case 'END_GAME': {
      // TODO! Save points to student account
      // TODO Rethink unsubscribing here... 
      // What if teacher wants to start a new game immediately after?
      const updatedGameState = { ...gameState, state: { endGame: true } };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('END_GAME action with payload:', JSON.stringify(payload));
      break;
    }
    case 'NEW_GAME': {
      context.handleSetAppState('gameState', payload);
      debug.log('NEW_GAME action with payload:', JSON.stringify(payload));
      break;
    }
    default:
      break;
  }
}

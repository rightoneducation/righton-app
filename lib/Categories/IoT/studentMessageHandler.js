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
      if (Object.keys(gameState).length === 0) {
        context.handleSetAppState('gameState', payload);
        debug.log('SET_GAME_STATE action with payload:', payload);
      }
      break;
    }
    case 'START_GAME': {
      const updatedGameState = { ...gameState, state: payload };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('START_GAME action with payload:', payload);
      break;
    }
    case 'UPDATE_TEAM_VALUE': {
      const updatedGameState = { ...gameState, ...payload };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('UPDATE_TEAM_VALUE action with payload:', payload);
      break;
    }
    case 'UPDATE_TEAM_TRICK': {
      const updatedGameState = { ...gameState };
      const { index, team } = data;
      updatedGameState[`team${team}`].tricks[index] = payload;
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('UPDATE_TEAM_TRICK action with payload:', payload);
      break;
    }
    case 'UPDATE_TEAM_CHOICES': {
      const updatedGameState = { ...gameState };
      const { team } = data;
      updatedGameState[`team${team}`].choices = payload;
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('UPDATE_TEAM_CHOICES action with payload:', payload);
      break;
    }
    default:
      break;
  }
}

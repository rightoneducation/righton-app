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
        context.handleSetAppState('gameState', payload);
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
    case 'UPDATE_TEAM_TRICK': {
      const updatedGameState = { ...gameState };
      const { index, teamRef } = data;
      updatedGameState[teamRef].tricks[index] = payload;
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('UPDATE_TEAM_TRICK action with payload:', JSON.stringify(payload));
      break;
    }
    case 'UPDATE_TEAM_CHOICES': {
      const updatedGameState = { ...gameState };
      const { teamRef } = data;
      updatedGameState[teamRef].choices = payload;
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('UPDATE_TEAM_CHOICES action with payload:', JSON.stringify(payload));
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
    default:
      break;
  }
}

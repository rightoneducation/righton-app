/* eslint no-param-reassign: 0 */
import debug from '../../../src/utils/debug';

export default function (message, context) {
  const data = JSON.parse(message.value.msg);
  const { uid } = data;

  if (context.messagesReceived[uid]) return;

  context.messagesReceived[uid] = true;

  const { action, payload } = data;
  const { gameState } = context.state;
  switch (action) {
    case 'SET_GAME_STATE': {
      if (Object.keys(gameState).length === 0) {
        context.handleSetGameState(payload);
        debug.log('SET_GAME_STATE action with payload:', payload);
      }
      break;
    }
    case 'UPDATE_TEAM_VALUE': {
      const updatedGameState = { ...gameState, ...payload };
      context.handleSetGameState(updatedGameState);
      debug.log('UPDATE_TEAM_VALUE action with payload:', payload);
      break;
    }
    default:
      break;
  }
}

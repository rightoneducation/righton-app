/* eslint no-param-reassign: 0 */
import debug from '../../../src/utils/debug';

export default function (message, context) {
  const data = JSON.parse(message.value.msg);
  const { uid } = data;

  if (context.messagesReceived[uid]) return;

  context.messagesReceived[uid] = true;

  const { action, payload } = data;
  switch (action) {
    case 'SET_GAME_STATE': {
      if (Object.keys(context.state.gameState).length === 0) {
        const gameState = { ...payload };
        context.handleSetAppState(gameState);
        debug.log('SET_GAME_STATE action with payload:', payload);
      }
      break;
    }
    case 'UPDATE_TEAM_VALUE': {
      const gameState = { ...context.state.gameState, ...payload };
      context.handleSetAppState(gameState);
      debug.log('UPDATE_TEAM_VALUE action with payload:', payload);
      break;
    }
    default:
      break;
  }
}

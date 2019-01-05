/* eslint no-param-reassign: 0 */
import { publishMessage } from './index';
import debug from '../../../src/utils/debug';

export default function (message, context) {
  const data = JSON.parse(message.value.msg);
  const { uid } = data;

  if (context.messagesReceived[uid]) return;

  context.messagesReceived[uid] = true;
  
  const { gameState } = context.state;
  const { action, payload } = data;
  switch (action) {
    case 'REQUEST_GAME_STATE': {
      const newMessage = {
        action: 'SET_GAME_STATE',
        uid: `${Math.random()}`,
        payload: gameState,
      };
      const parsedMessage = JSON.stringify(newMessage);
      publishMessage(gameState.GameRoomID, parsedMessage);
      debug.log('REQUEST_GAME_STATE action processed');
      break;
    }
    case 'UPDATE_TEAM_VALUE': {
      const updatedGameState = { gameState, ...payload };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('UPDATE_TEAM_VALUE action with payload:', payload);
      break;
    }
    default:
      break;
  }
}

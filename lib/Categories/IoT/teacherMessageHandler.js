/* eslint no-param-reassign: 0 */
import { publishMessage } from './index';
import debug from '../../../src/utils/debug';

export default function (message, context) {
  const data = message.value.msg;
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
      publishMessage(gameState.GameRoomID, newMessage);
      debug.log('REQUEST_GAME_STATE action processed');
      break;
    }
    case 'JOINED_GAME': {
      const { players } = context.state;
      const updatedPlayers = { ...players };
      updatedPlayers[payload.playerID] = payload.team;
      context.handleSetAppState('players', updatedPlayers);
      debug.log('JOINED_GAME action with payload:', JSON.stringify(payload));
      break;
    }
    case 'UPDATE_TEAM_VALUE': {
      const updatedGameState = { gameState, ...payload };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('UPDATE_TEAM_VALUE action with payload:', JSON.stringify(payload));
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
    default:
      break;
  }
}

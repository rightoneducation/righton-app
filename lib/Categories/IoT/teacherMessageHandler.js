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
    case 'PUSH_TEAM_TRICK': {
      const { teamRef } = data;
      const updatedGameState = { ...gameState };
      updatedGameState[teamRef].tricks.push(payload);
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('PUSH_TEAM_TRICK action with payload:', JSON.stringify(payload));
      break;
    }
    case 'UPDATE_TEAM_TRICK': {
      const updatedGameState = { ...gameState };
      const { index, teamRef } = data;
      updatedGameState[teamRef].tricks[index].selected = payload;
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('UPDATE_TEAM_TRICK action with payload:', JSON.stringify(payload));
      break;
    }
    case 'UPDATE_PLAYER_CHOICE_AND_TEAM_POINTS': {
      const updatedGameState = { ...gameState };
      const { index, points, teamRef } = data;
      updatedGameState[teamRef].choices[index].votes += 1;
      updatedGameState[points.teamRef].points += points.value;
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('UPDATE_PLAYER_CHOICE action with payload:', JSON.stringify(payload));
      break;
    }
    default:
      break;
  }
}

/* eslint no-param-reassign: 0 */
import { publishMessage } from './index';

export default function (message, context) {
  const data = JSON.parse(message.value.msg);
  const { uid } = data;

  if (context.messagesReceived[uid]) return;

  context.messagesReceived[uid] = true;

  const { gameState } = context.state;

  switch (data.action) {
    case 'REQUEST_GAME_STATE': {
      const newMessage = {
        action: 'SET_GAME_STATE',
        uid: `${Math.random()}`,
        ...gameState,
      };
      const parsedMessage = JSON.stringify(newMessage);
      publishMessage(gameState.GameRoomID, parsedMessage);
      break;
    }
    default:
      break;
  }
}

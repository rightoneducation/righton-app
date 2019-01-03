/* eslint no-param-reassign: 0 */

export default function (message, context) {
  const data = JSON.parse(message.value.msg);
  const { uid } = data;

  if (context.messagesReceived[uid]) return;

  context.messagesReceived[uid] = true;

  const { gameState } = context.state;

  switch (data.action) {
    case 'SET_GAME_STATE': {
      if (Object.keys(gameState).length === 0) {
        context.handleSetGameState(data.gameState);
      }
      break;
    }
    case 'UPDATE_TRICK_ANSWER': {
      const { answer, group } = data;
      
      break;
    }
    default:
      break;
  }
}

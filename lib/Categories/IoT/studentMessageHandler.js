import debug from '../../../src/utils/debug';

/*
 * Function to intercept and process Websocket messages between students and teacher
 * to facilitate game play protocols for student.
 */
export default function studentMessageHandler(message, context) {
  const data = message.value.msg;
  const { uid } = data;

  /* eslint no-param-reassign: 0 */
  /* 
   * Diasble @no-param-reassign to quickly register and check whether
   * message had been processed previously before processing.
   * - This is necessary due to repeated Websocket messages
   *   causing unnecessary updates to the core state.
   */
  if (context.messagesReceived[uid]) return;
  context.messagesReceived[uid] = true;

  const { gameState } = context.state;
  const { action, payload } = data;
  switch (action) {
    /*
     * Initial gameState sent by the teacher to each student at the beginning
     * of a game to set the initial state of values.
     */
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
    /*
     * Sets the current gameState as owned by the teacher after a student
     * drops from the Websocket i.e., goes into background mode/offline/disconnection
     * and then reconnects. This explicitly happens because the student reconnected
     * and sent a message to 'REQUEST_DROPPED_GAME_STATE' from the teacher.
     */
    case 'SET_DROPPED_GAME_STATE': {
      const { username } = context.state.deviceSettings;
      if (username === data.username) {
        context.handleSetAppState('gameState', payload);
        debug.log('SET_DROPPED_GAME_STATE action processed with payload:', JSON.stringify(payload));
      }
      break;
    }
    /*
     * A time setting update handler for when the teacher changes the quiz/trick timer values.
     */
    case 'UPDATE_GAME_SETTINGS': {
      const updatedGameState = {
        ...gameState,
        quizTime: payload.quizTime,
        trickTime: payload.trickTime,
      };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('UPDATE_GAME_SETTINGS action with payload:', JSON.stringify(payload));
      break;
    }
    /*
     * Handles changing the state of the gameState with a @payload = { start: true }.
     */
    case 'START_GAME': {
      const updatedGameState = { ...gameState, state: payload };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('START_GAME action with payload:', JSON.stringify(payload));
      break;
    }
    /*
     * Pushes a trick contribution from a fellow team member into their own gameStates.
     * Other team tricks are ignored because other players only care about the choices
     * for the multiple choice selection rendering.
     */
    case 'PUSH_TEAM_TRICK': {
      /* 
       * There's a cross-alignment between wanting the integer of the team as the
       * point of reference for quick access to arrays and also naming the
       * key property of the team object as `team#`.
       * - Consider changing the `team#` key to only the integer for a better experience.
       */
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
    /*
     * Updates a (de)selected team trick in the team appropriated gameStates
     * to signal to the teacher when the games begin of which tricks to include in choices.
     */
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
    /*
     * A handler for receiving and updating the choices for all students of the
     * current team's question being quizzed. This is allocated randomly by the teacher
     * based on which tricks were selected from the previous case: 'UPDATE_TEAM_TRICK'.
     */
    case 'SET_TEAM_CHOICES': {
      const updatedGameState = { ...gameState };
      if (Object.keys(data.state)) {
        // A segway method into setting state of game to `startQuiz`
        // when `handleGamePreview(teamRef)` is called in `handleNextTeam()`
        updatedGameState.state = data.state;
      }
      const { teamRef } = data;
      updatedGameState[teamRef].choices = payload;
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('SET_TEAM_CHOICES action with payload:', JSON.stringify(payload));
      break;
    }
    /*
     * Starts the current quiz with a gameState state @payload = { startQuiz: true }.
     * Screens are navigated from GameTricks into GamePreview/GameReasons respectively.
     */
    case 'START_QUIZ': {
      const updatedGameState = { ...gameState, state: payload };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('START_QUIZ action with payload:', JSON.stringify(payload));
      break;
    }
    /*
     * Updates a fellow student in an opposition team of their multiple choice
     * selection for the current team's gameState. 
     * - Only the current team updates their own state of the selection choice.
     */
    case 'UPDATE_PLAYER_CHOICE_AND_TEAM_POINTS': {
      // The 'TEAM_POINTS' portion only applies to the teacher's gameState.
      const { index, teamRef } = data;
      if (teamRef === `team${context.state.team}` && gameState[teamRef].choices[index]) {
        const updatedGameState = { ...gameState };
        updatedGameState[teamRef].choices[index].votes += 1;
        context.handleSetAppState('gameState', updatedGameState);
        debug.log('UPDATE_PLAYER_CHOICE action with payload:', JSON.stringify(payload));
      }
      break;
    }
    /*
     * Not to be confused with 'END_GAME' this case is particularly for ending
     * a quizzing round in GamePreview/GameReasons
     */
    case 'END_QUIZ': {
      const updatedGameState = { ...gameState, state: payload };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('END_QUIZ action with payload:', JSON.stringify(payload));
      break;
    }
    /*
     * Lets students know that the game is over - all teams have played their
     * rounds and the game will navigate to GameFinal for displaying results.
     */
    case 'END_GAME': {
      const { players } = data;
      const updatedGameState = { ...gameState, state: { endGame: true, players } };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('END_GAME action with payload:', JSON.stringify(payload));
      break;
    }
    /*
     * Handles setting up a new initial gameState with new game parameters
     * assigned by the teacher.
     */
    case 'NEW_GAME': {
      context.handleSetAppState('gameState', payload);
      debug.log('NEW_GAME action with payload:', JSON.stringify(payload));
      break;
    }
    /*
     * When the teacher exits the game prematurely an 'EXIT_GAME' message is 
     * sent to each student which automatically exits them from the game,
     * otherwise, if the student is GameFinal, they are displayed a button to exit
     * out to the Dashboard.
     */
    case 'EXIT_GAME': {
      const updatedGameState = { ...gameState, state: { exitGame: true } };
      context.handleSetAppState('gameState', updatedGameState);
      debug.log('EXIT_GAME action with payload:', JSON.stringify(payload));
      break;
    }
    default:
      break;
  }
}

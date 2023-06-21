import i18n from 'i18next';
import {
  ITeamAnswer,
  GameSessionState,
  isNullOrUndefined,
} from '@righton/networking';
import { InputPlaceholder, StorageKey } from './PlayModels';

/**
 * check if name entered isn't empty or the default value
 * TODO: add check for inappropriate words
 * @param name - the inputted string for the name
 * @returns - true if the name is valid, false otherwise
 */
export const isNameValid = (name: string) => {
  return (
    name.trim() !== '' && // check for falsy w/o spaces, typ
    name !== i18n.t('joingame.playername.firstnamedefault') && // check if default value, typ
    name !== i18n.t('joingame.playername.lastnamedefault')
  );
};

/**
 * check if gameCode is 4 characters, isn't empty and isn't the default value, is numeric
 * @param gameCode - the inputted string for the game code
 * @returns - true if the game code is valid, false otherwise
 */
export const isGameCodeValid = (gameCode: string) => {
  return (
    gameCode.trim() !== '' &&
    gameCode !== InputPlaceholder.GAME_CODE &&
    gameCode.length === 4 &&
    !Number.isNaN(parseInt(gameCode, 10))
  );
};

/**
 * on rejoining game, this checks if the player has already submitted an answer
 * @param hasRejoined - if a player is rejoining
 * @param answers - the answers submitted by the player previously
 * @param answerChoices - the answer choices for the question on the backend
 * @param currentState - the current state of the game session
 * @returns - the index of the answer the player has submitted, null if they haven't submitted an answer and boolean to track submission
 */
export const checkForSubmittedAnswerOnRejoin = (
  hasRejoined: boolean,
  answers: (ITeamAnswer | null)[] | null | undefined,
  answerChoices: {
    id: string;
    text: string;
    isCorrectAnswer: boolean;
    reason: string;
  }[],
  currentState: GameSessionState
): { selectedAnswerIndex: number | null; isSubmitted: boolean } => {
  let selectedAnswerIndex = null;
  let isSubmitted = false;

  if (
    hasRejoined &&
    (currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ||
      currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER)
  ) {
    if (!isNullOrUndefined(answers)) {
      answers.forEach((answer) => {
        if (answer) {
          answerChoices.forEach((answerChoice, index) => {
            if (answerChoice.text === answer.text) {
              if (
                (currentState === GameSessionState.CHOOSE_CORRECT_ANSWER &&
                  answer.isChosen) ||
                (currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER &&
                  answer.isTrickAnswer)
              ) {
                selectedAnswerIndex = index;
                isSubmitted = true;
              }
            }
          });
        }
      });
    }
  }
  return { selectedAnswerIndex, isSubmitted };
};

/**
 * validates localModel retrieved from local storage
 * separate function to allow for ease of testing
 * @param localModel - the localModel retrieved from local storage
 * @returns - the localModel if valid, null otherwise
 */
export const validateLocalModel = (localModel: string | null) => { 
  if (isNullOrUndefined(localModel) || localModel === '') return null;
  const parsedLocalModel = JSON.parse(localModel);
 
  // checks for invalid data in localModel, returns null if found
  if (
    [
      parsedLocalModel.currentTime,
      parsedLocalModel.gameSessionId,
      parsedLocalModel.teamId,
      parsedLocalModel.teamMemberId,
      parsedLocalModel.selectedAvatar,
      parsedLocalModel.hasRejoined,
      parsedLocalModel.currentTimer,
    ].some((value) => isNullOrUndefined(value) || value === '')
  ) {
    return null;
  }

  const currentTime = new Date().getTime() / 60000;
  const elapsedTime = currentTime - parsedLocalModel.currentTime;

  // if the time between last accessing localModel and now is greater than 2 hours, remove localModel
  if (elapsedTime > 120) {
   return null;
  }
  // passes validated localModel to GameInProgressContainer
  return parsedLocalModel;
};

/**
 * retrieves local data from local storage and calls validator function
 * @returns - the localModel if valid, null otherwise
 */
export const fetchLocalData = () => {
  const localModel = validateLocalModel(window.localStorage.getItem(StorageKey));
  if (!localModel)
    window.localStorage.removeItem(StorageKey);
  return localModel;
};
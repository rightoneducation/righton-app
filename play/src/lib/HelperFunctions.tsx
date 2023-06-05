import i18n from 'i18next';
import {
  ITeamAnswer,
  GameSessionState,
  isNullOrUndefined,
} from '@righton/networking';
import { InputPlaceholder } from './PlayModels';

/**
 * check if name entered isn't empty or the default value
 * TODO: add check for inappropriate words
 * @param name - the inputted string for the name
 * @returns - true if the name is valid, false otherwise
 */
export const isNameValid = (name: string) => {
  return (
    name.trim() !== '' && // check for falsy w/o spaces, typ
    name !== i18n.t('playername_firstnamedefault') && // check if default value, typ
    name !== i18n.t('playername_lastnamedefault')
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
 * @param isRejoin - if a player is rejoining
 * @param answers - the answers submitted by the player previously
 * @param answerChoices - the answer choices for the question on the backend
 * @param currentState - the current state of the game session
 * @returns - the index of the answer the player has submitted, null if they haven't submitted an answer and boolean to track submission
 */
export const checkForSubmittedAnswerOnRejoin = (
  isRejoin: boolean,
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
    isRejoin &&
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
 * retrieves local data from local storage and validates it
 * @returns - the pregameModel if valid, null otherwise
 */
export const fetchLocalData = () => {
  const pregameModel = window.localStorage.getItem('rightOn');
  if (isNullOrUndefined(pregameModel)) return null;

  const parsedPregameModel = JSON.parse(pregameModel);
  // checks for invalid data in pregameModel, returns null if found
  if (
    isNullOrUndefined(parsedPregameModel.gameSessionId) ||
    isNullOrUndefined(parsedPregameModel.teamId) ||
    isNullOrUndefined(parsedPregameModel.teamMemberId) ||
    isNullOrUndefined(parsedPregameModel.selectedAvatar) ||
    isNullOrUndefined(parsedPregameModel.isRejoin)
  )
    return null;
  // passes validated pregameModel to GameInProgressContainer
  return parsedPregameModel;
};

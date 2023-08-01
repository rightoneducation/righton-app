import i18n from 'i18next';
import {
  ITeamAnswer,
  ITeam,
  GameSessionState,
  isNullOrUndefined,
  IQuestion,
  ConfidenceLevel,
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
 * on rejoining game, this checks if the player has already selected a confidence level
 * @param hasRejoined - if a player is rejoining
 * @param answers - the answers submitted by the player previously
 * @param currentQuestion - the current question being answered
 * @param currentState - the current state of the game session
 * @returns - the index of the confidence the player has submitted, null if they haven't selected a confidence, boolean to track submission
 */
export const checkForSelectedConfidenceOnRejoin = (
  hasRejoined: boolean,
  answers: (ITeamAnswer | null)[] | null | undefined,
  currentQuestion: IQuestion,
  currentState: GameSessionState
): { selectedConfidenceIndex: number | null; isSelected: boolean; timeOfLastSelect: number | null; } => {
  let selectedConfidenceIndex = null;
  let isSelected = false;
  // here, since we do not store time of last select in the backend (5 seconds would be negligible on refresh),
  // we set the timeOfLastSelect to null to re-initialize the value instead of populating it with the previous value
  const timeOfLastSelect = null;
  // adding dictionary to account for string casting for material UI components
  const confidenceOptions = [
    ConfidenceLevel.NOT_AT_ALL,
    ConfidenceLevel.KINDA,
    ConfidenceLevel.QUITE,
    ConfidenceLevel.VERY,
    ConfidenceLevel.TOTALLY
  ]
  if (
    hasRejoined &&
    (currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ||
      currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER)
  ) {
    if (!isNullOrUndefined(answers)) {
      const currentAnswer = answers?.find(answer => answer?.questionId === currentQuestion.id);
      if (!isNullOrUndefined(currentAnswer)) {
        isSelected = currentAnswer.confidenceLevel !== ConfidenceLevel.NOT_RATED;
        selectedConfidenceIndex = confidenceOptions.indexOf(currentAnswer.confidenceLevel);
      }
    }
  }
  return { selectedConfidenceIndex, isSelected, timeOfLastSelect };
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
  const localModel = validateLocalModel(
    window.localStorage.getItem(StorageKey)
  );
  if (!localModel) window.localStorage.removeItem(StorageKey);
  return localModel;
};

/**
 * sorts teams by score descending, then alphabetically by name
 * only include teams with scores in the top five
 * See this discussion for more info on implementation:
 * https://github.com/rightoneducation/righton-app/pull/685#discussion_r1248353666
 * @param inputTeams - the teams to be sorted
 * @param totalTeamsReturned - the number of teams to be returned
 * @returns - the sorted teams
 */
export const teamSorter = (inputTeams: ITeam[], totalTeams: number) => {
  const sortedTeams = inputTeams.sort((lhs, rhs) => {
    if (lhs.score !== rhs.score) {
      return lhs.score - rhs.score;
    }
    return rhs.name.localeCompare(lhs.name);
  });
  let lastScore = -1;
  let totalTeamsReturned = totalTeams;
  const ret = []; // Array(totalTeamsReturned);
  for (
    let i = sortedTeams.length - 1;
    i >= 0 && totalTeamsReturned > 0;
    i -= 1
  ) {
    if (sortedTeams[i].score !== lastScore) {
      totalTeamsReturned -= 1;
    }
    ret.push(sortedTeams[i]);
    lastScore = sortedTeams[i].score;
  }
  return ret as ITeam[];
};

import i18n from 'i18next';
import {
  ITeamAnswer,
  ITeam,
  GameSessionState,
  isNullOrUndefined,
  ConfidenceLevel,
  IAnswerContent,
  IAnswerText
} from '@righton/networking';
import nlp from 'compromise';
import { InputPlaceholder, StorageKey, LocalModel, AnswerType, StorageKeyAnswer } from './PlayModels';

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
 * @param localModel - the localModel retrieved from local storage
 * @param hasRejoined - if a player is rejoining
 * @param answers - the answers submitted by the player previously
 * @param answerChoices - the answer choices for the question on the backend
 * @param currentState - the current state of the game session
 * @returns - the index of the answer the player has submitted, null if they haven't submitted an answer and boolean to track submission
 */
export const checkForSubmittedAnswerOnRejoin = (
  localModel: LocalModel,
  hasRejoined: boolean,
  currentState: GameSessionState,
  currentQuestionIndex: number
): IAnswerContent => {
  let returnedAnswer: IAnswerContent = {
    answers: [{
      rawText: '',
      normText: [''],
      type: AnswerType.TEXT,
    }],
    multiChoiceAnswerIndex: null,
    isSubmitted: false,
    currentState: null,
    currentQuestionIndex: null,
  }; 
  if (
    hasRejoined
  ) {
    if (localModel.answer !== null && localModel.answer.currentState === currentState && localModel.answer.currentQuestionIndex === currentQuestionIndex) {
      // set answer to localAnswer
      returnedAnswer = localModel.answer;
      console.log(returnedAnswer);
      // remove localAnswer from local storage
      localModel.answer = null; // eslint-disable-line no-param-reassign
      window.localStorage.setItem(StorageKey, JSON.stringify(localModel)); 
    }
  }
  return returnedAnswer as IAnswerContent;
};

/**
 * on rejoining game, this checks if the player has already selected a confidence level
 * @param hasRejoined - if a player is rejoining
 * @param currentAnswer - the player's answer to the current question
 * @param currentState - the current state of the game session
 * @returns - the index of the confidence the player has submitted, null if they haven't selected a confidence, boolean to track submission
 */
export const checkForSelectedConfidenceOnRejoin = (
  hasRejoined: boolean,
  currentAnswer: ITeamAnswer | null | undefined,
  currentState: GameSessionState
): {
  selectedConfidenceOption: string;
  isSelected: boolean;
  timeOfLastSelect: number;
} => {
  let selectedConfidenceOption = ConfidenceLevel.NOT_RATED;
  let isSelected = false;
  // here, since we do not store time of last select in the backend (5 seconds would be negligible on refresh),
  // we set the timeOfLastSelect to null to re-initialize the value instead of populating it with the previous value
  const timeOfLastSelect = 0;
  // adding dictionary to account for string casting for material UI components
  if (
    hasRejoined &&
    (currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ||
      currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) &&
    !isNullOrUndefined(currentAnswer)
  ) {
      isSelected = currentAnswer.confidenceLevel !== ConfidenceLevel.NOT_RATED;
      selectedConfidenceOption = currentAnswer.confidenceLevel;
  }
  return { selectedConfidenceOption, isSelected, timeOfLastSelect };
};

/**
 * validates localModel retrieved from local storage
 * separate function to allow for ease of testing
 * @param localModelBase - the localModel retrieved from local storage
 * @returns - the localModel if valid, null otherwise
 */
export const validateLocalModel = (localModelBase: string | null, localModelAnswer: string | null) => {
  if (isNullOrUndefined(localModelBase) || localModelBase === '') return null;
  const parsedLocalModel = JSON.parse(localModelBase);

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
  if (!isNullOrUndefined(localModelAnswer) && localModelAnswer !== '') {
    const parsedLocalModelAnswer = JSON.parse(localModelAnswer);
    parsedLocalModel.localAnswer = parsedLocalModelAnswer;
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
    window.localStorage.getItem(StorageKey), 
    window.localStorage.getItem(StorageKeyAnswer)
  );
  if (!localModel) {
    window.localStorage.removeItem(StorageKey);
    window.localStorage.removeItem(StorageKeyAnswer);
  }
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

/**
* function checks if input is a number
* used in normalizeAnswers to parse short answer responses
* @param num - the input to be checked
* @returns - true if the input is a number, false otherwise
* @see normalizeAnswers
*/ 
const isNumeric = (num: any) => (
  typeof(num) === 'number' || 
  typeof(num) === "string" && 
  num.trim() !== ''
) && !isNaN(num as number); // eslint-disable-line no-restricted-globals

/**
 * This function is run on submit of an answer and normalizes the contents of the Quill editor 
 * so that it can be compared to the answer choices on the host side
 * 
 * for more information see: 
 * @param currentContents: IAnswerText[]
 * @returns normalizedAnswers: IAnswerText[]
 */
export const handleNormalizeAnswers = (currentContents: IAnswerText[]): IAnswerText[] => {
  // used later in the map for removing special characters
  const specialCharsRegex = new RegExp(`[!@#$%^&*()_\\+=\\[\\]{};:'"\\\\|,.<>\\/?~-] `, 'gm');

  const normalizedAnswers = currentContents.map((answer) => {
    const normalizedAnswer: IAnswerText = {rawText: '', normText: [], type: AnswerType.TEXT};
    // replaces \n with spaces maintains everything else
    normalizedAnswer.rawText = `${answer.rawText.replace(/\n/g, " ")}`;

    if (answer.type === AnswerType.FORMULA) {
      // removes all spaces
      normalizedAnswer.normText?.push(`${answer.rawText.replace(/(\r\n|\n|\r|" ")/gm, "")}`);
    } else {
      // 2. if there is no formula, check if the user has entered a number
      if (isNumeric(answer.rawText) === true) {
        normalizedAnswer.normText?.push(answer.rawText);
        normalizedAnswer.type = AnswerType.NUMBER;
        return normalizedAnswer;
      }

      // 3. answer is a string. 
      //  we will produce a naive normalization of the string, attempting to extract numeric answers and then
      //  reducing case and removing characters

      // this extracts numeric values from a string and adds them to the normalized text array.
      // it then removes those numbers from the string
      const extractedNumbers = normalizedAnswer.rawText.match(/-?\d+(\.\d+)?/g)?.map(Number);
      const numbersRemoved = normalizedAnswer.rawText.replace(/-?\d+(\.\d+)?/g, '');
      if (extractedNumbers) {
        normalizedAnswer.normText?.push(...extractedNumbers);
        normalizedAnswer.type = AnswerType.NUMBER;
      }

      // this attempts to extract any written numbers (ex. fifty five) after removing any special characters 
      // eslint-disable-next-line prefer-regex-literals
      const detectedNumbers = nlp(numbersRemoved.replace(specialCharsRegex, "")).numbers().json();
      if (detectedNumbers.length > 0) {
        // answer.normText = answer.rawText.reduce((acc: number, curr: string) => `${acc}${curr.replace(/\n/g, "")}`, "");
        detectedNumbers.forEach((number: any) => normalizedAnswer.normText?.push(parseFloat(number.number.num)))
        normalizedAnswer.type = AnswerType.NUMBER;
      } 
      // 4. any remaining content is grabbed together 
      //    set normalized input to lower case and remove spaces
      normalizedAnswer.normText?.push(numbersRemoved.toLowerCase().replace(/(\r\n|\n|\r|" ")/gm, "").trim());
    }
    return normalizedAnswer;
  });

  return normalizedAnswers;
};
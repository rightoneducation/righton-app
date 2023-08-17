import {
  isNullOrUndefined,
} from '@righton/networking';
// import * as DOMPurify from 'dompurify';
import {  StorageKey, MistakeObject, InputType, AnswerObject } from './HostModels';

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

export const answerMatchAndSort =(
  newAnswer: MistakeObject,
  sortedAnswers: MistakeObject[],
) => {
  const totalAnswers = sortedAnswers.reduce((acc, curr) => curr.count + acc, 0);
  let isMatch = false;

  sortedAnswers.forEach((answer, index) => {
    if (answer.normalizedInput === newAnswer.normalizedInput) {
      sortedAnswers[index].count += 1;
      isMatch = true;
    } 
    answer.percent = Math.round((answer.count / (totalAnswers + 1)) * 100);
  });
  if (!isMatch){
    newAnswer.percent = Math.round((newAnswer.count / (totalAnswers + 1)) * 100);
    sortedAnswers.push({...newAnswer, count: 1});
  }

  sortedAnswers.sort((a, b) => b.count - a.count);

  return sortedAnswers;
};

export const parseAnswerToMistake = (
  answerInput: AnswerObject,
): MistakeObject => {
  const rawInput = answerInput.rawTexts.reduce((acc, curr) => `${acc}${curr.replace(/\n/g, "")}`, "");
  const normalizedInput = answerInput.normalizedTexts.reduce((acc, curr) =>`${acc}${curr.toLowerCase().replace(/(\r\n|\n|\r|" ")/gm, "")}`, "");
  const inputType = InputType.TEXT;
  const percent = 0;
  const count = 1;
  const isSelected = false;
  return {
    rawInput: rawInput,
    normalizedInput: normalizedInput, 
    inputType: inputType, 
    percent: percent, 
    count: count,
    isSelected: isSelected,
  } as MistakeObject;
};
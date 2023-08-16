import {
  isNullOrUndefined,
} from '@righton/networking';
// import * as DOMPurify from 'dompurify';
import {  StorageKey, HostAnswerObject, SortedAnswerObject, InputType } from './HostModels';

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
  sortedAnswers: SortedAnswerObject[],
  newAnswer: HostAnswerObject,
) => {

  // step two: if numeric, check the input for numbers that match the answer
  switch (newAnswer.inputType){
    default: {
      sortedAnswers.find((answer, index) => {
        if (answer.normalizedInput === newAnswer.normalizedInput)
          sortedAnswers[index].count += 1;
          sortedAnswers.sort((a, b) => b.count - a.count);
          return sortedAnswers;
      });
      sortedAnswers.push({...newAnswer, count: 1});
      return sortedAnswers;
    } 
  }
};
import {
  isNullOrUndefined,
} from '@righton/networking';
import { evaluate } from 'mathjs';
import nlp from 'compromise';
// import * as DOMPurify from 'dompurify';
import {  StorageKey, SubmittedAnswerObject, InputType, ClientAnswerObject, AnswerType } from './HostModels';
import { parse } from '@babel/core';

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

const isAnswerMatch = (newAnswer: SubmittedAnswerObject, existingAnswer: SubmittedAnswerObject) => { 
  if (existingAnswer.inputType === InputType.NUMBER && newAnswer.inputType === InputType.NUMBER) {
      // using a set here because it's faster than nested for loops
      let set1 = new Set<number>(newAnswer.normalizedInput as number[]);
      for (let i = 0; i < existingAnswer.normalizedInput.length; i++) {
        if (set1.has(existingAnswer.normalizedInput[i] as number)) 
          return true;
      }
  };
  if (existingAnswer.inputType === InputType.FORMULA && newAnswer.inputType === InputType.FORMULA) {
    // if new mistake has a formula, evaluate it to catch lowest common denominators etc
    if (existingAnswer.normalizedInput[0] === newAnswer.normalizedInput[0]) 
      return true;
    try {
      const answerExpression = evaluate(newAnswer.normalizedInput[0] as string);
      const inputExpression = evaluate(existingAnswer.normalizedInput[0] as string);
      if (answerExpression === inputExpression) {
       return true;
      }
    } catch (e) {
      console.log(e);
    }
  };
  if (existingAnswer.inputType === InputType.STRING && newAnswer.inputType === InputType.STRING) {
    // if new mistake is a string, simple comparison
    if (newAnswer.normalizedInput[0] === existingAnswer.normalizedInput[0]) 
      return true;
  };

  return false;
}

export const answerMatchAndSort =(
  newAnswer: SubmittedAnswerObject,
  sortedAnswers: SubmittedAnswerObject[],
) => {
  const totalAnswers = sortedAnswers.reduce((acc, curr) => curr.count + acc, 0);
  let isMatch = false;

  // adjust percentages and check for match
  sortedAnswers.forEach((answer, index) => {
    if (isAnswerMatch(newAnswer, answer)) {
      sortedAnswers[index].count += 1;
      isMatch = true;
    } 
    answer.percent = Math.round((answer.count / (totalAnswers + 1)) * 100);
  });
  if (!isMatch){
    newAnswer.percent = Math.round((newAnswer.count / (totalAnswers + 1)) * 100);
    sortedAnswers.push({...newAnswer, count: 1});
  }
  // sorts by percentage
  sortedAnswers.sort((a, b) => b.percent - a.percent);

  return sortedAnswers;
};

export const packageSubmittedAnswer = (
  answerInput: ClientAnswerObject,
): SubmittedAnswerObject => {
  // raw input:
  // replaces \n with spaces maintains everything else
  const rawInput = answerInput.rawTexts.reduce((acc, curr) => `${acc}${curr.replace(/\n/g, " ")}`, "");
  // normalized input: 
  // default values for normalized answer object:
  let normalizedInput = [];
  let inputType = InputType.STRING;

  // 1. if there is a formula, assume that is the player's answer
  //    remove empty spaces or new lines and set it to normalized answer
  const formulaIndex = answerInput.answerTypes.findIndex((type)  => type === AnswerType.FORMULA);
  if (formulaIndex !== -1){
     normalizedInput.push(answerInput.normalizedTexts[formulaIndex].replace(/(\r\n|\n|\r|" ")/gm, ""));
     inputType = InputType.FORMULA;
  } else {

    // 2. if there is no formula, scan string for numbers
    //    special characters, math operators outside of formula blow up our number parser and should just be treated as strings
    //    if just numbers found, extract numbers and set it to normalized answer
    const specialChars = /[`$%*()\/]/;
    const specialCharsCheck = specialChars.test(rawInput);
    const detectedNumbers = nlp(rawInput).numbers().json();

    if (!specialCharsCheck && detectedNumbers.length > 0) {
       detectedNumbers.forEach((number: any) => normalizedInput.push(parseFloat(number.number.num)))
      inputType = InputType.NUMBER;
    } else {

      // 3. if there is no formula and no numbers
      //    set normalized input to lower case and remove spaces
      normalizedInput.push(rawInput.toLowerCase().replace(/(\r\n|\n|\r|" ")/gm, ""));
    }
  }

  return {
    rawInput: rawInput,
    normalizedInput: normalizedInput, 
    inputType: inputType, 
    percent: 0, 
    count: 1,
    isSelected: false,
  } as SubmittedAnswerObject;
};